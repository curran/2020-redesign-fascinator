import {
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  scaleTime,
  extent,
} from 'd3';

// Use the same size as the images, no client-side resampling.
import { size } from './constants';

const simulation = forceSimulation().force('collide', forceCollide(size / 2));

const xValue = (d) => d.date;

const margin = { left: 100, right: 100 };

export const viz = ({ selection, width, height, data }) => {
  if (!data) return;

  const nodes = selection
    .selectAll('image')
    .data(data)
    .join((enter) =>
      enter
        .append('image')
        .attr('href', (d) => d.thumbnailDataURL)
        .attr('height', size)
    );

  simulation.nodes(data);

  const innerWidth = width - margin.left - margin.right;
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([margin.left, innerWidth]);

  simulation
    .force('y', forceY(height / 2).strength(1))
    .force('x', forceX((d) => xScale(xValue(d))).strength(0.5))
    .on('tick', () => {
      nodes.attr('x', (d) => d.x - size / 2).attr('y', (d) => d.y - size / 2);
    });
};
