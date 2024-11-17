// const path = require('path');
import path from "path";
import { fileURLToPath } from 'url';
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

export default {
  mode: 'development',
  entry: './src/App.ts',
  devServer: {
    port: 9000,
    open: true,
    static: {
      serveIndex: true,
      directory: path.dirname(fileURLToPath(import.meta.url))
    },
    watchFiles: ['src/**/*', 'assets/**/*']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
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
};