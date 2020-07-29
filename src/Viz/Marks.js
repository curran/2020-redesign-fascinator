import { useRef, useEffect } from 'react';
import { select, forceSimulation, forceX, forceY, forceCollide } from 'd3';

// Use the same size as the images, no client-side resampling.
import { size, radius } from '../constants';

// Factor to multiply the size by for hovered entry.
const enlargement = 1.5;

const simulation = forceSimulation();

// This is the portion where D3 takes over DOM manipulation.
const marks = ({
  selection,
  height,
  data,
  xScale,
  xValue,
  onMouseEnter,
  onMouseLeave,
  hoveredEntry,
}) => {
  // Each node has a parent group that listens for mouse events.
  const nodesUpdate = selection.selectAll('.node').data(data);
  const nodesEnter = nodesUpdate
    .enter()
    .append('g')
    .attr('class', 'node')
    .on('mouseenter', (d) => onMouseEnter(d))
    .on('mouseleave', onMouseLeave);
  const nodes = nodesUpdate.merge(nodesEnter);

  // Each parent group contains an image.
  const imagesUpdate = nodes.select('image');
  const imagesEnter = nodesEnter
    .append('image')
    .attr('href', (d) => d.thumbnailDataURL);
  imagesUpdate
    .merge(imagesEnter)
    .attr('height', (d) => (d === hoveredEntry ? size * enlargement : size))
    .attr('width', (d) => (d === hoveredEntry ? size * enlargement : size));

  // Each parent group contains a link that opens the work page.
  const linksUpdate = nodesUpdate.select('a');
  const linksEnter = nodesEnter
    .append('a')
    .attr('href', (d) => `${window.location.origin}/work/${d.post_name}`)
    .attr('target', '_blank')
    .attr('rel', 'noopener noreferrer')
    .style('pointer-events', 'all');

  // Each link contains a circle that intercepts mouse events
  // and provides the stroke around the circularly masked images.
  const circlesUpdate = linksUpdate.select('circle');
  const circlesEnter = linksEnter.append('circle').attr('fill', 'none');
  circlesUpdate
    .merge(circlesEnter)
    .attr('stroke', (d) => (d === hoveredEntry ? 'yellow' : 'white'))
    .attr('r', (d) => (d === hoveredEntry ? radius * enlargement : radius));

  // Update the collide force to know about the hovered entry.
  simulation.force(
    'collide',
    forceCollide((d) => (d === hoveredEntry ? radius * enlargement : radius))
  );

  simulation.nodes(data);

  simulation
    .force('y', forceY(height / 2))
    .force(
      'x',
      forceX((d) => xScale(xValue(d)))
    )
    .on('tick', () => {
      nodes.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
};

export const Marks = ({
  height,
  data,
  xScale,
  xValue,
  onMouseEnter,
  onMouseLeave,
  hoveredEntry,
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
      hoveredEntry,
    });
  }, [height, data, xScale, xValue, hoveredEntry, onMouseEnter, onMouseLeave]);

  return <g ref={ref} />;
};
