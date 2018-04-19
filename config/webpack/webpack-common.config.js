const path = require('path');
// const nodeExternals = require('webpack-node-externals');

function nodeExternals() {
  return function (context, request, callback) {
    const ignore = [
      /@blackbaud\/skyux\-logger/,
      /pix\-diff/,
      /protractor/
    ];

    // Mark these modules as external.
    // https://webpack.js.org/configuration/externals/#function
    for (let i = 0, len = ignore.length; i < len; i++) {
      if (ignore[i].test(request)) {
        return callback(null, `commonjs ${request}`);
      }
    }

    callback();
  };
}

module.exports = {
  mode: 'development',
  entry: './index.ts',
  target: 'node',
  externals: [
    nodeExternals()
  ],
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
};
