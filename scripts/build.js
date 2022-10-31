const { Webpack } = require('zj-webpack')
const webpackConfig = require('../webpack.config')

const webpack = new Webpack({
	...webpackConfig,
	mode: 'production'
})
webpack.bundle()
