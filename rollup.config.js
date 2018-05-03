import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './dist/index.js',
  output: {
    file: './dist/bundles/index.umd.min.js',
    format: 'umd',
    globals: {
      '@blackbaud/skyux-logger': 'logger',
      'pix-diff': 'PixDiff',
      'protractor': 'protractor'
    },
    name: 'skyux-lib-e2e'
  },
  context: 'this',
  plugins: [
    nodeResolve(),
    commonjs(),
    uglify()
  ],
  external: [
    '@blackbaud/skyux-logger',
    'pix-diff',
    'protractor'
  ]
};
