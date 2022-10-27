const fs = require('fs')
const path = require('path')

const initHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="./index.css" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script src="./bundle.js"></script>
</body>
</html>`

class HtmlPlugin {
  constructor(config = {}) {
    const { template, fileName } = config

    this.tamplate = template || initHtml
    this.fileName = fileName || 'index.html'
  }

  createHtml(webpackConfig) {
    // todo 检查是否有打包输入文件夹，没有则创建
    const hasFileDir = fs.existsSync(webpackConfig.output)
    if (!hasFileDir) {
      fs.mkdirSync(webpackConfig.output)
    }

    // todo 将html模版内容写入html文件
    const filePath = path.join(webpackConfig.output, this.fileName)
    fs.writeFileSync(filePath, this.tamplate)
  }

  run(compile) {
    // todo 将createHtmlFn注册到webpack的afterDistSync钩子队列，打包时执行
    const createHtmlFn = this.createHtml.bind(this, compile.config)
    compile.hooks.afterDistSync.tap(createHtmlFn)
  }
}

module.exports = HtmlPlugin
