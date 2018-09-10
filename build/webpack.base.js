const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    app: './app.js',
    vender: ['marked', 'prismjs']
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: "../"
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      },
      template: path.resolve(__dirname, '../src/index.tpl.html')
    }),
    new ExtractTextPlugin('[name].[chunkhash].css')
  ]
}