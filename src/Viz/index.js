import { extent, scaleTime } from 'd3';
import { useMemo } from 'react';
import { Marks } from './Marks';

const xValue = (d) => d.date;

const margin = { left: 100, right: 100 };

export const Viz = ({ width, height, data }) => {
  const xScale = useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    return scaleTime()
      .domain(extent(data, xValue))
      .range([margin.left, innerWidth]);
  }, [data, innerWidth]);

  return (
    <svg width={width} height={height}>
      <Marks data={data} height={height} xScale={xScale} xValue={xValue} />
    </svg>
  );
};
