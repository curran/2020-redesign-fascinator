import { extent, scaleTime } from 'd3';
import { useMemo, useCallback, useState } from 'react';
import { Tooltip } from './Tooltip';
import { Marks } from './Marks';

const xValue = (d) => d.date;

const margin = { left: 100, right: 200 };

export const Viz = ({ width, height, data }) => {
  const xScale = useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    return scaleTime()
      .domain(extent(data, xValue))
      .range([0, innerWidth]);
  }, [data, width]);

  const [hoveredEntry, setHoveredEntry] = useState(null);

  const handleMouseEnter = useCallback(
    (d) => {
      setHoveredEntry(d);
    },
    [setHoveredEntry]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredEntry(null);
  }, [setHoveredEntry]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},0)`}>
        <Tooltip
          height={height}
          xValue={xValue}
          hoveredEntry={hoveredEntry}
          line
        />
        <Marks
          data={data}
          height={height}
          xScale={xScale}
          xValue={xValue}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          hoveredEntry={hoveredEntry}
        />
        <Tooltip
          height={height}
          xValue={xValue}
          hoveredEntry={hoveredEntry}
          text
          blackStroke
        />
        <Tooltip
          height={height}
          xValue={xValue}
          hoveredEntry={hoveredEntry}
          text
        />
      </g>
    </svg>
  );
};
