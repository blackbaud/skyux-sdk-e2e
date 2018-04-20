const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack-common.config');

module.exports = webpackMerge(common, {
  mode: 'production',

  // Disable sourcemaps for production:
  // https://webpack.js.org/configuration/devtool/#production
  devtool: undefined,

  output: {
    path: path.resolve(__dirname, '..', '..', 'dist', 'bundles'),
    filename: 'skyux-visual.umd.js',
    library: 'SkyVisual',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, '..', '..', 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: false
          }
        }
      }
    ]
  }
});
