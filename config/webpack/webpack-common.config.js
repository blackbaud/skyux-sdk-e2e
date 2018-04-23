const path = require('path');

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
  ]
};
