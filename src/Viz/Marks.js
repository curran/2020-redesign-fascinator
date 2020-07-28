import { useRef, useEffect } from 'react';
import { select, forceSimulation, forceX, forceY, forceCollide } from 'd3';

// Use the same size as the images, no client-side resampling.
import { size } from '../constants';

const simulation = forceSimulation().force('collide', forceCollide(size / 2));

// This is the portion where D3 takes over DOM manipulation.
const marks = ({ selection, height, data, xScale, xValue }) => {
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
    .force('x', forceX((d) => xScale(xValue(d))).strength(0.5))
    .on('tick', () => {
      nodes.attr('x', (d) => d.x - size / 2).attr('y', (d) => d.y - size / 2);
    });
};

export const Marks = ({ height, data, xScale, xValue }) => {
  const ref = useRef();

  useEffect(() => {
    const selection = select(ref.current);
    marks({ selection, height, data, xScale, xValue });
  }, [height, data, xScale, xValue]);

  return <g ref={ref} />;
};
