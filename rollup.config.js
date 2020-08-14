import buble from '@rollup/plugin-buble';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  external: ['d3', 'react', 'react-dom'],
  output: {
    file: 'bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      d3: 'd3',
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  plugins: [
    json(),
    buble({
      objectAssign: 'Object.assign',
      transforms: { asyncAwait: false },
    }),
    nodeResolve(),
  ],
};
