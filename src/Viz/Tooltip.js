import { timeFormat } from 'd3';

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
  text,
  line,
}) => {
  if (!hoveredEntry) return null;

  // Get exactly 1px wide lines that fall on the pixel exactly.
  const x = Math.round(hoveredEntry.x) + 0.5;

  const yearLabel = yearFormat(xValue(hoveredEntry));
  const titleLabel = hoveredEntry.post_title;

  const textFill = blackStroke ? 'none' : 'yellow';
  const textStroke = blackStroke ? 'black' : 'none';

  return (
    <g transform={`translate(${x},0)`} style={{ pointerEvents: 'none' }}>
      {line ? <line y2={height - tickLineYOffset} stroke="yellow" /> : null}
      {text ? (
        <g transform={`translate(${textXOffset},0)`}>
          <text
            y={height - tickLabelYOffset}
            alignmentBaseline="middle"
            fontFamily="HelveticaNeue, sans-serif"
            fontSize="26px"
            fill={textFill}
            stroke={textStroke}
            strokeWidth={3}
          >
            {yearLabel}
          </text>
          <text
            y={height - titleLabelYOffset}
            alignmentBaseline="middle"
            fontFamily="HelveticaNeue, sans-serif"
            fontSize="18px"
            fill={textFill}
            stroke={textStroke}
            strokeWidth={3}
          >
            {titleLabel}
          </text>
        </g>
      ) : null}
    </g>
  );
};
