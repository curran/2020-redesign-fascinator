import { useRef, useEffect } from 'react';
import { select, timeFormat } from 'd3';

const yearFormat = timeFormat('%Y');

// The distance from the bottom to the end of the line.
const tickLineYOffset = 60;

// Distance from the bottom to the year label.
const tickLabelYOffset = 40;

// Distance from the bottom to the title label.
const titleLabelYOffset = 13;

// The amount by which the text is moved to the left of the line.
const textXOffset = -29;

// Unique ID per entry.
const key = (d) => d.ID;

// Get exactly 1px wide lines that fall on the pixel exactly.
const xExact = (d) => Math.round(d.x) + 0.5;

// The number of milliseconds for the line animation.
const lineTransitionDuration = 1000;

// The number of milliseconds for the text animation.
const textTransitionDuration = 400;

// The number of milliseconds before the end of the line transition
// that the text transition starts.
const textTransitionAnticipation = 200;

export const Tooltip = ({
  height,
  xValue,
  data,
  hoveredEntry,
  blackStroke,
  text,
}) => {
  const ref = useRef();

  useEffect(() => {
    const g = select(ref.current);

    g.selectAll('line')
      .data(data, key)
      .join(
        (enter) =>
          enter.append('line').attr('stroke', 'yellow'),
        (update) =>
          update
            .attr('x1', xExact)
            .attr('x2', xExact)
            .attr('y1', (d) => d.y)
            .attr('y2', (d) => d.y)
            .call((update) =>
              update
                .transition()
                .duration(lineTransitionDuration)
                .attr('y2', (d) =>
                  d === hoveredEntry
                    ? height - tickLineYOffset
                    : d.y
                )
            )
      );

    const textFill = blackStroke ? 'none' : 'yellow';
    const textStroke = blackStroke ? 'black' : 'none';

    const labels = (d) => [
      {
        text: yearFormat(xValue(d)),
        x: d.x + textXOffset,
        y: height - tickLabelYOffset,
        fontSize: '26px',
      },
      {
        text: hoveredEntry.post_title,
        x: d.x + textXOffset,
        y: height - titleLabelYOffset,
        fontSize: '18px',
      },
    ];

    g.selectAll('text')
      .data(
        text && hoveredEntry ? labels(hoveredEntry) : []
      )
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('alignment-baseline', 'middle')
            .attr(
              'font-family',
              'HelveticaNeue, sans-serif'
            )
            .attr('font-size', (d) => d.fontSize)
            .attr('fill', textFill)
            .attr('stroke', textStroke)
            .attr('stroke-width', 4)
            .text((d) => d.text)
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y)
            .attr('opacity', 0),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .delay(textTransitionDuration)
              .attr('x', (d) => d.x)
              .attr('y', (d) => d.y)
              .text((d) => d.text)
          ),
        (exit) =>
          exit.call((exit) =>
            exit
              .transition('opacity')
              .duration(textTransitionDuration)
              .attr('opacity', 0)
              .remove()
          )
      )
      .transition('opacity')
      .delay(
        lineTransitionDuration - textTransitionAnticipation
      )
      .duration(textTransitionDuration)
      .attr('opacity', 1);
  }, [
    data,
    hoveredEntry,
    blackStroke,
    height,
    text,
    xValue,
  ]);

  return (
    <g style={{ pointerEvents: 'none' }} ref={ref}></g>
  );
};
