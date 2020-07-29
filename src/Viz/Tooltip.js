import { timeFormat } from 'd3';

const yearFormat = timeFormat('%Y');

const tickLabelYOffset = 30;
const titleLabelYOffset = 10;

export const Tooltip = ({ height, xValue, hoveredEntry }) => {
  if (!hoveredEntry) return null;

  // Get exactly 1px wide lines that fall on the pixel exactly.
  const x = Math.round(hoveredEntry.x) + 0.5;

  const yearLabel = yearFormat(xValue(hoveredEntry));
  const titleLabel = hoveredEntry.post_title;

  return (
    <g transform={`translate(${x},0)`}>
      <line y2={height - tickLabelYOffset * 2} stroke="yellow" />
      <g transform={`translate(0,${height - tickLabelYOffset})`}>
        <text
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="HelveticaNeue, sans-serif"
          fontSize="24px"
          fill="yellow"
        >
          {yearLabel}
        </text>
        <text
          y={titleLabelYOffset}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="HelveticaNeue, sans-serif"
          fontSize="20px"
          fill="yellow"
        >
          {titleLabel}
        </text>
      </g>
    </g>
  );
};
