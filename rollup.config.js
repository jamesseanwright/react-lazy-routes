
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';

export default ({ inlineDynamicImports }) => ({
  input: 'src/index.jsx',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  inlineDynamicImports,
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    nodeGlobals(),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        '@babel/syntax-dynamic-import',
        '@babel/transform-react-jsx',
      ],
    }),
  ],
});
