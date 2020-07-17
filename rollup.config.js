import buble from '@rollup/plugin-buble';

export default {
  input: 'index.js',
  external: ['d3'],
  output: {
    file: 'bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: { d3: 'd3', react: 'React', 'react-dom': 'ReactDOM' },
  },
  plugins: [
    buble({
      objectAssign: 'Object.assign',
    }),
  ],
};
