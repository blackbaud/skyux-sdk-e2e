const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack-prod.config');

module.exports = webpackMerge(common, {
  watch: false,
  mode: 'production',
  // Disable sourcemaps for production:
  // https://webpack.js.org/configuration/devtool/#production
  devtool: undefined
});
