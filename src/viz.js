import { forceSimulation, forceX, forceY, forceCollide } from 'd3';

const size = 50;

const simulation = forceSimulation().force('collide', forceCollide(size + 3));

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

  simulation
    .force('y', forceY(height / 2).strength(1))
    .force('x', forceX(width / 2).strength(0.05))
    //.force('x', forceX((d) => xScale(xValue(d))).strength(1))
    .on('tick', () => {
      nodes.attr('x', (d) => d.x - size / 2).attr('y', (d) => d.y - size / 2);
    });
};
