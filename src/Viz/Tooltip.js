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

export const Tooltip = ({
  height,
  xValue,
  hoveredEntry,
  blackStroke,
  line,
  text,
}) => {
  const ref = useRef();

  useEffect(() => {
    const g = select(ref.current);

    if (hoveredEntry) {
      // Get exactly 1px wide lines that fall on the pixel exactly.
      const x = Math.round(hoveredEntry.x) + 0.5;
      g.attr('transform', `translate(${x},0)`);
    }

    g.selectAll('line')
      .data(line && hoveredEntry ? [hoveredEntry] : [])
      .join((enter) =>
        enter
          .append('line')
          .attr('stroke', 'yellow')
          .call((update) =>
            update
              .transition()
              .attr('y2', height - tickLineYOffset)
          )
      );

    const textFill = blackStroke ? 'none' : 'yellow';
    const textStroke = blackStroke ? 'black' : 'none';

    g.selectAll('text')
      .data(text && hoveredEntry ? [hoveredEntry] : [])
      .join((enter) =>
        enter
          .append('text')
          .attr('x', textXOffset)
          .attr('y', height - tickLabelYOffset)
          .attr('alignmentBaseline', 'middle')
          .attr('fontFamily', 'HelveticaNeue, sans-serif')
          .attr('fontSize', '26px')
          .attr('fill', textFill)
          .attr('stroke', textStroke)
          .attr('strokeWidth', 3)
          .text((d) => yearFormat(xValue(d)))
      );
  }, [hoveredEntry]);
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
