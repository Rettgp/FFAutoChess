const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/App.ts',
  devServer: {
    port: 9000,
    open: true,
    static: {
      serveIndex: true,
      directory: __dirname
    },
    watchFiles: ['src/**/*', 'assets/**/*']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin({configFile: "tsconfig.json"})],
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  }
}