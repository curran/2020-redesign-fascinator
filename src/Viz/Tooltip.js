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
  line,
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
            .call((update) =>
              update
                .transition()
                .duration(lineTransitionDuration)
                .attr('y2', (d) =>
                  d === hoveredEntry
                    ? height - tickLineYOffset
                    : 0
                )
            )
      );

    const textFill = blackStroke ? 'none' : 'yellow';
    const textStroke = blackStroke ? 'black' : 'none';

    g.selectAll('text')
      .data(text && hoveredEntry ? [hoveredEntry] : [], key)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('x', (d) => d.x + textXOffset)
            .attr('y', height - tickLabelYOffset)
            .attr('alignment-baseline', 'middle')
            .attr(
              'font-family',
              'HelveticaNeue, sans-serif'
            )
            .attr('font-size', '26px')
            .attr('fill', textFill)
            .attr('stroke', textStroke)
            .attr('stroke-width', 3)
            .text((d) => yearFormat(xValue(d)))
            .attr('opacity', 0)
            .call((enter) =>
              enter
                .transition()
                .delay(
                  lineTransitionDuration -
                    textTransitionAnticipation
                )
                .duration(textTransitionDuration)
                .attr('opacity', 1)
            ),
        (update) => update,
        (exit) =>
          exit.call((exit) =>
            exit
              .transition()
              .duration(textTransitionDuration)
              .attr('opacity', 0)
              .remove()
          )
      );
  }, [data, hoveredEntry]);
  // {text ? (
  //   <g transform={`translate(${textXOffset},0)`}>
  //     <text
  //       y={height - titleLabelYOffset}
  //       alignmentBaseline="middle"
  //       fontFamily="HelveticaNeue, sans-serif"
  //       fontSize="18px"
  //       fill={textFill}
  //       stroke={textStroke}
  //       strokeWidth={3}
  //     >
  //       {titleLabel}
  //     </text>
  //   </g>
  // ) : null}

  //const titleLabel = hoveredEntry.post_title;

  return (
    <g style={{ pointerEvents: 'none' }} ref={ref}></g>
  );
};
