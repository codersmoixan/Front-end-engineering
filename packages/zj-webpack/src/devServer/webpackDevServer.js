const path = require('path')
const MemoryFileSystem = require('memory-fs')
const SparkMD5 = require('spark-md5')
const Koa = require('koa')
const staticResource = require('koa-static')
const { WebSocketServer } = require('ws')

class WebpackDevServer {
  constructor(webpack) {
    this.webpack = webpack
    this.config = webpack.config
    this.memoFs = new MemoryFileSystem() // 内存文件系统
		this.hash = { // 文件hash
			jsHash: '',
			cssHash: ''
		}
		this.wsConnection = null
		this.bundleFilePath = ''
		this.app = null // 本地服务
		this.port = webpack.config.port ?? 8080
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

	}

  run() {
    this.initBundleCode()
		this.createServer()
		this.connectWebSocket()
		this.watchFiles()
  }
}

module.exports = WebpackDevServer
