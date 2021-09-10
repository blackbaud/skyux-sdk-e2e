import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

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
    terser()
  ],
  external: [
    '@blackbaud/skyux-logger',
    'pix-diff',
    'protractor'
  ]
};
