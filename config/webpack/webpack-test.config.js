const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack-prod.config');

module.exports = webpackMerge(common, {
  devtool: 'inline-source-map',
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
