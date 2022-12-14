const path = require('path')
const HtmlPlugin = require('./packages/zj-plugins/htmlPlugin')
const cssLoader = require('./packages/zj-webpack/src/loader/cssLoader')
const zjLoader = require('./packages/zj-webpack/src/loader/zjLoader')

module.exports = {
  mode: 'development', // development | production
	rootPath: __dirname,
  entry: path.join(__dirname, './src/index.zj'),
  output: path.join(__dirname, '/dist'),
	port: 5173,
  plugins: [
    new HtmlPlugin(),
    // new CssExtractPlugin()
  ],
  rules: [
    {
      test: /\.css$/,
      use: [cssLoader]
    },
    {
      test: /\.zj$/,
      use: [zjLoader]
    }
  ]
}
