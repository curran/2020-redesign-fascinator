import { forceSimulation, forceX, forceY, forceCollide } from 'd3';

const radius = 50;

const simulation = forceSimulation().force('collide', forceCollide(radius + 3));

export const viz = ({ selection, width, height, data }) => {
  if (!data) return;

  const circles = selection
    .selectAll('circle')
    .data(data)
    .join((enter) =>
      enter
        .append('circle')
        .attr('fill', '#ffff00')
        .attr('r', radius)
        .attr('cx', () => Math.random() * width)
        .attr('cy', () => Math.random() * height)
    );

  simulation.nodes(data);

  simulation
    .force('y', forceY(height / 2).strength(1))
    .force('x', forceX(width / 2).strength(0.05))
    //.force('x', forceX((d) => xScale(xValue(d))).strength(1))
    .on('tick', () => {
      circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });
};
