const Webpack = require('../../packages/zj-webpack/src/compiler/index')
const WebpackDevServer = require('../../packages/zj-webpack/src/devServer/webpackDevServer')
const webpackConfig = require('../../webpack.config')

const webpack = new Webpack(webpackConfig)
// webpack.callAfterDistSync()
const devServer = new WebpackDevServer(webpack)
devServer.run()
