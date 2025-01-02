import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const createConfig = (format, fileName, outputExports = 'named', bundleDeps = false) => ({
  input: 'src/index.js',
  output: {
    file: fileName,
    format,
    name: format === 'umd' ? 'IkSupport' : undefined,
    globals: format === 'umd' && !bundleDeps ? {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM'
    } : undefined,
    exports: outputExports
  },
  external: bundleDeps ? [] : ['react', 'react-dom', 'react-dom/client'],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      exclude: 'node_modules/**'
    }),
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    format === 'umd' && terser()
  ].filter(Boolean)
});

export default [
  // ESM build (for bundlers)
  createConfig('esm', 'dist/index.esm.js'),
  // CJS build (for Node.js)
  createConfig('cjs', 'dist/index.js'),
  // UMD build without bundled dependencies (smaller, requires React/ReactDOM)
  createConfig('umd', 'dist/ik-support.umd.js'),
  // UMD build with bundled dependencies (larger, standalone)
  createConfig('umd', 'dist/ik-support.standalone.umd.js', 'named', true)
];