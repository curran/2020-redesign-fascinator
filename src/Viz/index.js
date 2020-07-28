import { extent, scaleTime } from 'd3';
import { useMemo } from 'react';
import { Axis } from './Axis';
import { Marks } from './Marks';

const xValue = (d) => d.date;

const margin = { left: 100, right: 200 };

export const Viz = ({ width, height, data }) => {
  const xScale = useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    return scaleTime().domain(extent(data, xValue)).range([0, innerWidth]);
  }, [data, innerWidth]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},0)`}>
        <Axis height={height} xScale={xScale} />
        <Marks data={data} height={height} xScale={xScale} xValue={xValue} />
      </g>
    </svg>
  );
};
