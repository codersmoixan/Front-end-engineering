class CssExtractPlugin {
  constructor(config = {}) {
    this.fileName = config.fileName || 'index.css'
  }

  createCss(compiler) {
    let cssCode = ''

    return cssCode
  }

  extractCSS(compiler) {
    const cssCode = this.createCss(compiler)
  }

  run(compiler) {
    // todo 将extractCSS注册到afterDistSync钩子队列 打包时执行
    const extractCSSFn = this.extractCSS.bind(this, compiler)
    compiler.hooks.afterDistSync.tap(extractCSSFn)
  }
}

module.exports = CssExtractPlugin
