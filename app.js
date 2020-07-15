import { viz } from './viz';

export const app = ({ selection, width, height, data }) => {
  selection.style('background', 'black');

  const svg = selection
    .selectAll('svg')
    .data([1])
    .join((enter) => enter.append('svg'))
    .attr('width', width)
    .attr('height', height);

  viz({ selection: svg, width, height, data });
};
