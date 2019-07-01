import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default ({ inlineDynamicImports }) => ({
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  inlineDynamicImports,
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs({
      namedExports: {
        'node_modules/react-dom/index.js': ['render'],
        'node_modules/react/index.js': [
          'Component',
          'PropTypes',
          'Fragment',
          'Suspense',
          'createElement',
          'useEffect',
          'useState',
          'useContext',
          'createContext',
          'lazy',
        ],
      },
    }),
    nodeGlobals(),
    typescriptPlugin({
      typescript,
    }),
    terser({
      mangle: {
        toplevel: true,
      },
    }),
  ],
});
