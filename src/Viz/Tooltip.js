import { timeFormat } from 'd3';

const yearFormat = timeFormat('%Y');

const tickLabelYOffset = 20;

export const Tooltip = ({ height, xScale }) => {
  return (
    <g>
      {xScale.ticks().map((d) => {
        // Get exactly 1px wide lines that fall on the pixel exactly.
        const x = Math.round(xScale(d)) + 0.5;

        const label = yearFormat(d);

        return (
          <g key={label} transform={`translate(${x},0)`}>
            <line y2={height - tickLabelYOffset * 2} stroke="white" />
            <text
              y={height - tickLabelYOffset}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontFamily="HelveticaNeue, sans-serif"
              fontSize="20px"
              fill="white"
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
