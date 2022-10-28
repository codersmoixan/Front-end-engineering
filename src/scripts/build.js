const Webpack = require('../../packages/zj-webpack/src/compiler/index')
const webpackConfig = require('../../webpack.config')

const webpack = new Webpack({
	...webpackConfig,
	mode: 'production'
})
webpack.bundle()
