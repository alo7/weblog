import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify-es'
import replace from 'rollup-plugin-replace'
import { version, author } from './package.json'
import rollupTypescript from 'rollup-plugin-typescript'
import typescript from 'typescript'

const env = process.env.NODE_ENV;

const onwarn = warning => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    console.error(`(!) ${warning.message}`);
  }
}

const banner =
  '/*!\n' +
  ' * WebLog v' + version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' ' + author + '\n' +
  ' * Released under the MIT License.\n' +
  ' */';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(env)
  }),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  rollupTypescript({
    typescript
  }),
  cjs({
    namedExports: {
      'node_modules/es6-promise/dist/es6-promise.js': [ 'Promise' ]
    }
  }),
  babel({
    exclude: 'node_modules/**',
    externalHelpers: true
  }),
  (env === 'production' && uglify())
]

export default [{
  input: 'src/index.ts',
  plugins: plugins,
  onwarn: onwarn,
  output: {
    file: 'dist/weblog.js',
    banner,
    env,
    format: 'umd',
    name: 'WebLog',
    sourcemap: false,
  }
}]
