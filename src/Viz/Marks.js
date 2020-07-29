import { useRef, useEffect } from 'react';
import { select, forceSimulation, forceX, forceY, forceCollide } from 'd3';

// Use the same size as the images, no client-side resampling.
import { size } from '../constants';

const simulation = forceSimulation().force('collide', forceCollide(size / 2));

// This is the portion where D3 takes over DOM manipulation.
const marks = ({
  selection,
  height,
  data,
  xScale,
  xValue,
  onMouseEnter,
  onMouseLeave,
}) => {
  const nodes = selection
    .selectAll('image')
    .data(data)
    .join((enter) =>
      enter
        .append('image')
        .attr('href', (d) => d.thumbnailDataURL)
        .attr('height', size)
        .on('mouseenter', (d) => onMouseEnter(d))
        .on('mouseleave', onMouseLeave)
    );

  simulation.nodes(data);

  simulation
    .force('y', forceY(height / 2))
    .force(
      'x',
      forceX((d) => xScale(xValue(d)))
    )
    .on('tick', () => {
      nodes.attr('x', (d) => d.x - size / 2).attr('y', (d) => d.y - size / 2);
    });
};

export const Marks = ({
  height,
  data,
  xScale,
  xValue,
  onMouseEnter,
  onMouseLeave,
}) => {
  const ref = useRef();

  useEffect(() => {
    const selection = select(ref.current);
    marks({
      selection,
      height,
      data,
      xScale,
      xValue,
      onMouseEnter,
      onMouseLeave,
    });
  }, [height, data, xScale, xValue]);

  return <g ref={ref} />;
};
