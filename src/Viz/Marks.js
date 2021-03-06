import { useRef, useEffect } from 'react';
import {
  select,
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  forceManyBody,
} from 'd3';

import { hoveredRadius, hoveredSize } from '../constants';

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
    .transition()
    .attr(
      'x',
      (d) =>
        -(d === hoveredEntry ? hoveredSize : d.size) / 2
    )
    .attr(
      'y',
      (d) =>
        -(d === hoveredEntry ? hoveredSize : d.size) / 2
    )
    .attr('width', (d) =>
      d === hoveredEntry ? hoveredSize : d.size
    )
    .attr('height', (d) =>
      d === hoveredEntry ? hoveredSize : d.size
    );

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
    .on('mouseenter', (d) => onMouseEnter(d))
    .on('mouseleave', onMouseLeave)
    .transition()
    .attr('stroke', (d) =>
      d === hoveredEntry ? 'yellow' : 'white'
    )
    .attr('stroke-width', (d) =>
      d === hoveredEntry ? 2 : 1
    )
    .attr('r', (d) =>
      d === hoveredEntry ? hoveredRadius : d.radius
    );

  // Update the collide force to know about the hovered entry.
  simulation
    .nodes(data)
    .force(
      'collide',
      forceCollide((d) => d.radius + collidePadding)
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
  useEffect(() => {
    data.forEach((d) => {
      // If the entry is the hovered entry,
      // make it larger and
      // fix it so it doesn't move.
      if (d === hoveredEntry) {
        d.fx = d.x;
        d.fy = d.y;
      } else {
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

  useEffect(() => {
    data.forEach((d) => {
      d.fx = 3000;
      d.fy = height / 2;
      d.vx = 0;
      d.vy = 0;
    });
    let i = 0;
    const revealPoint = () => {
      data[i].fx = null;
      data[i].fy = null;
      i++;
      if (i < data.length) {
        simulation.alphaTarget(0.05);
        setTimeout(revealPoint, 200);
      } else {
        simulation.alphaTarget(0.0);
      }
    };
    revealPoint();
  }, [data, height]);

  return <g ref={ref} />;
};
