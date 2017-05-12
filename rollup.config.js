import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './index.js',
  format: 'umd',
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  sourceMap: true,
  dest: 'dist/build.js',
};
