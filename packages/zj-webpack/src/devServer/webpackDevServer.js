const path = require('path')
const MemoryFileSystem = require('memory-fs')
const SparkMD5 = require('spark-md5')
const Koa = require('koa')
const staticResource = require('koa-static')
const { WebSocketServer } = require('ws')
const { DirectoryWatcher } = require('../../../zj-watchpack/src/index')

class WebpackDevServer {
  constructor(webpack) {
    this.webpack = webpack
    this.config = webpack.config
    this.memoFs = new MemoryFileSystem() // 内存文件系统
		this.watcher = null // 文件监听器
		this.wsConnection = null
		this.bundleFilePath = ''
		this.app = null // 本地服务
		this.port = webpack.config.port ?? 8080
		this.hash = { // 文件hash
			jsHash: '',
			cssHash: ''
		}
		this.watcherFileType = { // 需要监听文件的后缀
			js: ['js', 'zj'],
			css: ['css', 'less']
		}
  }

	/**
	 * @description 初始化bundle代码
	 * */
  initBundleCode() {
    this.memoFs.mkdirpSync('/memoStatic')

    const bundleCode = this.webpack.createBundle('serverBundle')
		if (bundleCode) {
			const filePath = '/memoStatic/bundle.js'
			this.bundleFilePath = filePath

			this.memoFs.writeFileSync(filePath, bundleCode)
			this.hash.jsHash = this.generateHash(filePath)
		}
  }

	/**
	 * @description 更新bundle代码
	 * @param {string} path
	 * */
	updateBundle(path) {
		const fileSuffix = path.substr(path.lastIndexOf('.') + 1)
		const hasWatcherFileTypeJs = this.watcherFileType.js.includes(fileSuffix)
		const hasWatcherFileTypeCss = this.watcherFileType.css.includes(fileSuffix)

		if (hasWatcherFileTypeJs) {
			const jsCode = this.webpack.createNewBundle(path)
			this.memoFs.writeFileSync(this.bundleFilePath, jsCode)
			this.hash.jsHash = this.generateHash(this.bundleFilePath)
		}
	}

	/**
	 * @description 生成文件hash
	 * @param {string} path
	 */
	generateHash(path) {
		const spark = new SparkMD5()
		const buffer = this.memoFs.readFileSync(path)
		spark.append(buffer)

		return spark.end()
	}

	/**
	 * @description 创建一个服务用来运行项目
	 * */
	createServer() {
		const app = new Koa()
		app.use(staticResource(path.join(__dirname, 'public')))

		app.use(async ctx => {
			if (ctx.url === '/bundle.js') {
				ctx.set('Content-Type', 'application/javascript')
				ctx.body = this.memoFs.readFileSync(this.bundleFilePath)
			}
		})

		app.listen(this.port, () => {
			console.log(`dev-server启动在${this.port}端口`);
		})

		this.app = app
	}

	/**
	 * @description 开启webSocket连接
	 * */
	connectWebSocket() {
		this.webSocket = new WebSocketServer({ port: 3001 })
		this.webSocket.on('connection', (wsConnection) => {
			this.wsConnection = wsConnection
			wsConnection.send(this.hash.jsHash)
		})
	}

	/**
	 * @description 监听文件的变动触发热更新
	 * */
	watchFiles() {
		// 创建文件监视器
		const srcPath = path.resolve(this.config.entry, '..')
		this.watcher = new DirectoryWatcher({
			directoryList: [srcPath],
		})

		// 检查是否为依赖文件
		const isDepFile = path => this.webpack.deepList.has(path)

		// todo 热更新change事件
		//  文件变更时触发热更新，重新生成bundle代码，保存到内存，发送hash给客户端，客户端判断hash变更，然后拉取新代码
		this.watcher.on('change', path => {
			if (isDepFile(path)) {
				this.updateBundle(path)
			}
		})

		// todo 热更新create事件
		this.watcher.on('create', path => {
			if (isDepFile(path)) {
				console.log(`${path}创建新模块，重新打包后生效`)
			}
		})

		// todo 热更新delete事件
		this.watcher.on('delete', path => {
			if (isDepFile(path)) {
				console.log(`删除模块${path}, 重新打包`)
			}
		})

		this.watcher.watch()
	}

  run() {
    this.initBundleCode()
		this.createServer()
		this.connectWebSocket()
		this.watchFiles()
  }
}

module.exports = WebpackDevServer
