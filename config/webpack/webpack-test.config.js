const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack-common.config');

module.exports = webpackMerge(common, {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, '..', '..', 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [
          path.resolve(__dirname, '..', '..', 'node_modules')
        ],
        options: {
          emitErrors: true,
          failOnHint: true,
          resourcePath: 'src'
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: false
          }
        }
      },
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader!source-map-inline-loader',
        include: path.resolve(__dirname, '..', '..', 'src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
          /index\.ts/
        ]
      }
    ]
  }
});
