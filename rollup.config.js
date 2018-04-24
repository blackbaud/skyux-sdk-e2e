import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './dist/index.js',
  dest: './dist/bundles/index.umd.min.js',
  format: 'umd',
  moduleName: 'skyux-visual',
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
