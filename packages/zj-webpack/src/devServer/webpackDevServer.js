const MemoryFileSystem = require('memory-fs')

class WebpackDevServer {
  constructor(webpack) {
    this.webpack = webpack
    this.config = webpack.config
    this.memoFs = new MemoryFileSystem() // 内存文件系统
  }

  initBundleCode() {
    this.memoFs.mkdirpSync('/memoStatic')

    const bundleCode = this.webpack.createBundle('serverBundle')

  }

  run() {
    this.initBundleCode()
  }
}

module.exports = WebpackDevServer
