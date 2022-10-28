const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const SyncHooks = require('../hooks/syncHooks')
const { renderProgress, calculateTotalSteps} = require("../utils/progressBar/render");
const { addFileSuffix, compressByUglify } = require("../utils/helper")
const changeColor = require("../utils/progressBar/changeColor");

class Webpack {
  constructor(webpackConfig) {
    this.config = webpackConfig
    this.manifest = null // 细节图
    this.deepList = new Set()
    this.fileID = -1
		this.Manifast = []
    this.hooks = {
      beforeCompileSync: new SyncHooks(),
      afterCompileSync: new SyncHooks(),
      beforeDistSync: new SyncHooks(),
      afterDistSync: new SyncHooks()
    }

    this.initLifeCycleHooks()
  }

  initLifeCycleHooks() {
    // todo 处理挂载到plugins的所有方法
    const plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.run(this)
      })
    }
  }

  callBeforeCompileSync() {
    this.hooks.beforeCompileSync.call()
  }
  callAfterCompileSync() {
    this.hooks.afterCompileSync.call()
  }
  callBeforeDistSync() {
    this.hooks.beforeDistSync.call()
  }
  callAfterDistSync() {
    this.hooks.afterDistSync.call()
  }

	/**
	 * @description 处理代码的后续配置
	 * @param {string} codeString
	 * */
	useConfig(codeString) {
		// todo 生产环境的代码进行压缩
		if (this.config.mode === 'production') {
			codeString = compressByUglify(codeString)
		}

		return codeString
	}

	/**
	 * @description 完成构建进度条的显示
	 * @param {string} tag
	 * */
	renderFinished(tag) {
		switch (tag) {
			case 'bundle':
				renderProgress(changeColor('√', 92), { done: true })
				console.log(changeColor(`构建完成`, 92));
				break
			case 'serverBundle':
				renderProgress(changeColor('√', 92), { done: true })
				console.log(changeColor(`构建完成，访问 ${changeColor(`http://localhost:${this.config.port}`, 96)} \n\n`, 92))
				break
			case 'hotUpdate':
				console.log(changeColor(`热模块替换完成`));
				break
			default:
				renderProgress(changeColor('√', 92), { done: true })
				console.log(changeColor('构建完成', 92))
				break
		}
	}

  /**
   * @description 构建文件资源
   * @param {string} absolutePath
   * */
  createAssets(absolutePath) {
    // 调用用户的loader
    absolutePath = addFileSuffix(absolutePath)
    const fileContent = this.useCustomLoader(absolutePath)

    // 排除非js和zj后缀的文件
    const isJSFile = /\.js$/.test(absolutePath)
    const isZJFile = /\.zj$/.test(absolutePath)
    if (!isJSFile && !isZJFile) {
      return null
    }
    this.deepList.add(absolutePath)

    renderProgress(`构建${absolutePath}`, { step: 8 })
    // 将index的代码转为AST语法数
    const ast = parser.parse(fileContent, {
      sourceType: 'module'
    })

    /**
     * 遍历ast语法树 将所有import文件推入deeps数组
     * visitor配置钩子函数，不同的钩子会返回不同的语句
     * 遍历到对应的语句，就会执行钩子函数，返回语句的信息 (详见AST Exporer)
     * */
    const dependencies = []

    traverse(ast, {
      ImportDeclaration: path => { // todo 遇到import语句,将文件路径push到依赖数组
        const depFilePath = addFileSuffix(path.node.source.value)
        path.node.source.value = depFilePath

				dependencies.push(depFilePath)
        if (/\.css$/.test(depFilePath)) {
          path.remove()
        }
      },
      CallExpression: path => {
        const calleeName = path.node.callee?.name

        if (calleeName === 'require') { // todo 遇到require语句,将文件路径push到依赖数组
          const depFilePath = addFileSuffix(path.node.arguments[0].value)
          path.node.arguments[0].value = depFilePath

					dependencies.push(depFilePath)
          if (/\.css$/.test(depFilePath)) {
            path.remove()
          }
        }
      }
    })

    /**
     * 将ast转为ES5语法
     * 第三个参数配置babel转化插件(preset是使用的插件集合)
     * */
    const es5Code = babel.transformFromAstSync(ast, null, {
      presets: ['@babel/preset-env']
    })

    return {
      fileID: this.fileID += 1,
      filePath: absolutePath,
      code: es5Code.code,
			dependencies
    }
  }

  /**
   * @description 构建模块 生成bundle代码
   * @param {string} tag
   * */
  createBundle(tag) {
    const manifest = this.createManifest(this.config.entry)
		this.manifest = manifest

		const modulesString = this.createModules(manifest) // 生成modules
		const bundleCode = this.createOutputCode(modulesString) // 生成输出代码
		this.renderFinished(tag)

		return bundleCode
  }

  /**
   * @description 构建文件依赖图
   * @param {string} entry
   * */
  createManifest(entry) {
    // 1. 通过入口文件来构建文件资源
    const mainAssets = this.createAssets(entry)

		// 2. 通过队列循环方式构建依赖图
		const queue = [mainAssets]

		for (const assets of queue) {
			renderProgress(`构建依赖${assets.filePath}`)
			const dirname = path.dirname(assets.filePath) // 当前处理文件的绝对路径
			const deps = assets.dependencies
			assets.mapping = {}

			// 遍历文件的依赖文件
			for (const depFilePath of deps) {
				const depFileAbsolutePath = this.getDepAbsoluteFilePath(depFilePath, dirname) // 预处理路径，获取依赖文件的路径
				assets.mapping[depFilePath] = depFileAbsolutePath // 通过相对路径和绝对路径匹配 构建资源依赖图

				if (queue.some(module => module.filePath === depFileAbsolutePath)) {
					continue
				}

				const childAssets = this.createAssets(depFileAbsolutePath) // 构建子文件的文件资源
				if (childAssets) { // 处理好的子文件资源推入到队列中，childAssets在下一个循环继续执行
					queue.push(childAssets)
				}
			}
		}

		this.fileID = -1
		this.Manifast = queue

    return queue
  }

	/**
	 * @description 通过依赖图来生成模块对象集合
	 * @param {object} manifest 依赖关系图
	 * */
	createModules(manifest) {
		let modulesString = ''

		manifest.forEach(module => {
			renderProgress(`打包模块${module.filePath}`)

			const key = JSON.stringify(module.filePath)
			const mapping = JSON.stringify(module.mapping)
			const code = `(require, module, exports) => {${module.code}}`

			// 单个模块资源
			const modulesPart = `${key}: {\n code: ${code},\n mapping: ${mapping}}, \n`
			modulesString += modulesPart
		})

		return `{${modulesString}}`
	}

  /**
   * @description 使用自定义loader
   * */
  useCustomLoader(absolutePath) {
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    const rules = this.config.rules

    // 处理loader
    let result = fileContent
    rules.forEach(rule => {
      if (rule.test.test(absolutePath)) {
        rule.use.forEach(loader => {
          result = loader(result)
        })
      }
    })

    return result
  }

	/**
	 * @description 获取依赖列表的路径的绝对路径
	 * @param {string} depFilePath
	 * @param {string} dirname
	 * @return {string}
	 * */
	getDepAbsoluteFilePath(depFilePath, dirname) {
		let absolutePath = ''

		console.log(depFilePath, dirname)
		if (depFilePath[0] === '.') { // 如果以 . 开头，则代表是当前dirname的同级目录下的文件 直接返回当前dirname所拼接的路径
			// 添加后缀
			depFilePath = addFileSuffix(depFilePath)
			absolutePath = path.join(dirname, depFilePath)
		} else {
			absolutePath = this.findDepEntry(depFilePath)
		}

		return absolutePath
	}

	/**
	 * @description 从node_modules中查找入口
	 * @param {string} depName 包名
	 * */
	findDepEntry(depName) {
		const rootPath = this.config.rootPath
		const depDirPath = path.join(rootPath, '/node_modules', depName)
		const packageJsonPath = path.join(depDirPath, 'package.json')
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
		const entry = path.join(depDirPath, packageJson.main)

		return entry
	}

	/**
	 * @description 生出输出到bundle.js代码
	 * @param {string} modulesString 序列化的models代码
	 * */
	createOutputCode(modulesString) {
		// 保存所有已经被加载的模块
		const installedChunks = {}

		const result = `
			(function (){
				// 传入modules
				const modules = ${modulesString}

				// module缓存
				const modulesCache = {}

				// 创建require函数，获取modules的函数代码和mapping对象
				function require(absolutePath) {
					const { code: fn, mapping } = modules[absolutePath]

					const localRequire = (relativePath) => require(mapping[relativePath])

					const cacheModule = modulesCache[absolutePath]
					if (cacheModule !== undefined) { // 如果缓存中有当前缓存的模块，直接返回此缓存模块
						return cacheModule.exports
					}

					// 如果缓存中没有此模块，则创建一个新的缓存
					const module = modulesCache[absolutePath] = {
						exports: {}
					}

					fn.apply(null, [localRequire, module, module.exports])

					return module.exports
				}

				// 执行require入口模块
				require(${JSON.stringify(this.config.entry)})
			})();
		`

		return result
	}

	/**
	 * @description 将打包好的代码输出到dist目录
	 * @param {string} outputCode
	 * */
	outputDistDir(outputCode) {
		// todo 检查是否有dist目录，没有则创建
		const hasDistDir = fs.existsSync(this.config.output)
		if (!hasDistDir) {
			fs.mkdirSync(this.config.output)
		}

		// todo 写入文件
		fs.writeFileSync(`${this.config.output}/bundle.js`, outputCode)

		const coloredPath = changeColor(path.basename(this.config.output), 96)
		console.log(`打包成功，请查看${coloredPath}目录！`)
	}

	/**
	 * @description 打包代码
	 * */
	bundle() {
		calculateTotalSteps(this.config.entry) // 计算进度条

		this.callBeforeCompileSync()
		const bundleCode = this.createBundle('bundle')
		this.callAfterCompileSync()

		const outputCode = this.useConfig(bundleCode)

		this.callBeforeDistSync()
		this.outputDistDir(outputCode)
		this.callAfterDistSync()
	}
}

module.exports = Webpack
