const { Webpack, WebpackDevServer } = require('zj-webpack')
const webpackConfig = require('../webpack.config')

const webpack = new Webpack(webpackConfig)
const devServer = new WebpackDevServer(webpack)
devServer.run()
