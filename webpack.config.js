const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'none',
  resolve: {
    extensions: ['.js']
  },
  entry: {
    'routing-pattern': path.join(__dirname, 'src/index.js')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  // Use globalObject: 'this' to make the library work in browser and node
  // see https://webpack.js.org/configuration/output/#outputlibrary
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, './dist'),
    globalObject: 'this'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
