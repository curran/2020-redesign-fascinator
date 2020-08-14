import { useRef, useEffect } from 'react';
import {
  select,
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  forceManyBody,
} from 'd3';

// Use the same size as the images, no client-side resampling.
import { size, radius } from '../constants';

// Factor to multiply the size by for hovered entry.
const enlargement = 2;

// Pixels gap to leave between circles.
const collidePadding = 3;

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
  const nodesUpdate = selection
    .selectAll('.node')
    .data(data);
  const nodesEnter = nodesUpdate
    .enter()
    .append('g')
    .attr('class', 'node');
  const nodes = nodesUpdate.merge(nodesEnter);

  // Each parent group contains an image.
  const imagesUpdate = nodes.select('image');
  const imagesEnter = nodesEnter
    .append('image')
    .attr('href', (d) => d.thumbnailDataURL);
  imagesUpdate
    .merge(imagesEnter)
    .attr('x', (d) => -d.size / 2)
    .attr('y', (d) => -d.size / 2)
    .attr('height', (d) => d.size)
    .attr('width', (d) => d.size);

  // Each parent group contains a link that opens the work page.
  const linksUpdate = nodesUpdate.select('a');
  const linksEnter = nodesEnter
    .append('a')
    .attr(
      'href',
      (d) => `${window.location.origin}/work/${d.post_name}`
    )
    .attr('target', '_blank')
    .attr('rel', 'noopener noreferrer')
    .style('pointer-events', 'all');

  // Each link contains a circle that intercepts mouse events
  // and provides the stroke around the circularly masked images.
  const circlesUpdate = linksUpdate.select('circle');
  const circlesEnter = linksEnter
    .append('circle')
    .attr('fill', 'none');
  circlesUpdate
    .merge(circlesEnter)
    .attr('stroke', (d) =>
      d === hoveredEntry ? 'yellow' : 'white'
    )
    .attr('r', (d) =>
      d === hoveredEntry ? radius * enlargement : radius
    )
    .on('mouseenter', (d) => onMouseEnter(d))
    .on('mouseleave', onMouseLeave);

  // Update the collide force to know about the hovered entry.
  simulation
    .nodes(data)
    .force(
      'collide',
      forceCollide(
        (d) =>
          (d === hoveredEntry
            ? radius * enlargement
            : radius) + collidePadding
      )
    )
    .force('charge', forceManyBody())
    .velocityDecay(0.1)
    .force('y', forceY(height / 2))
    .force(
      'x',
      forceX((d) => xScale(xValue(d)))
    )
    .on('tick', () => {
      nodes.attr(
        'transform',
        (d) => `translate(${d.x},${d.y})`
      );
    })
    .alphaTarget(hoveredEntry ? 0.01 : 0)
    .restart();
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

  // Compute the size of things based on the hovered entry.
  // Better to do it in one place like this instead of
  // duplicated across all logic that depends on it.
  // 🌶️ Mutates the `size` and `radius` properties on data array elements.
  useEffect(() => {
    data.forEach((d) => {
      // If the entry is the hovered entry,
      // make it larger and
      // fix it so it doesn't move.
      if (d === hoveredEntry) {
        d.size = size * enlargement;
        d.radius = radius * enlargement;
        d.fx = d.x;
        d.fy = d.y;
      } else {
        d.size = size;
        d.radius = size;
        d.fx = null;
        d.fy = null;
      }
    });
  }, [data, hoveredEntry]);

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
  }, [
    height,
    data,
    xScale,
    xValue,
    hoveredEntry,
    onMouseEnter,
    onMouseLeave,
  ]);

  return <g ref={ref} />;
};
