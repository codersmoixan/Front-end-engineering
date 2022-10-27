const fs = require('fs')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const SyncHooks = require('../hooks/syncHooks')
const { renderProgress } = require("../utils/progressBar/render");

class Webpack {
  constructor(webpackConfig) {
    this.config = webpackConfig
    this.manifest = null // 细节图
    this.deepList = new Set()
    this.fileID = -1
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
   * @description 添加文件后缀
   * @param {string} path
   * @return {string}
   * */
  addFileSuffix(path) {
    if (path[0] !== '.' && path[1] !== ':') {
      return path
    }

    const index = path.lastIndexOf(".");
    const ext = path.substr(index + 1);

    if (ext.length > 5) {
      path = path + '.js'
    }

    return path
  }

  /**
   * @description 构建文件资源
   * @param {string} absolutePath
   * */
  createAssets(absolutePath) {
    // 调用用户的loader
    absolutePath = this.addFileSuffix(absolutePath)
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
    const deeps = []

    traverse(ast, {
      ImportDeclaration: path => { // todo 遇到import语句,将文件路径push到依赖数组
        const depFilePath = this.addFileSuffix(path.node.source.value)
        path.node.source.value = depFilePath

        deeps.push(depFilePath)
        if (/\.css$/.test(depFilePath)) {
          path.remove()
        }
      },
      CallExpression: path => {
        const calleeName = path.node.callee?.name

        if (calleeName === 'require') { // todo 遇到require语句,将文件路径push到依赖数组
          const depFilePath = this.addFileSuffix(path.node.arguments[0].value)
          path.node.arguments[0].value = depFilePath

          deeps.push(depFilePath)
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
      deeps
    }
  }

  /**
   * @description 构建模块 生成bundle代码
   * @param {string} tag
   * */
  createBundle(tag) {
    const manifest = this.createManifest(this.config.entry)
  }

  /**
   * @description 构建文件依赖图
   * @param {string} entry
   * */
  createManifest(entry) {
    // 通过入口文件来构建文件资源
    const mainAssets = this.createAssets(entry)

    return mainAssets
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
}

module.exports = Webpack
