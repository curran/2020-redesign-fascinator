import { select, extent, scaleTime } from 'd3';
import { useRef, useEffect, useMemo } from 'react';
import { marks } from './marks';

const xValue = (d) => d.date;

const margin = { left: 100, right: 100 };

export const Viz = ({ width, height, data }) => {
  const ref = useRef();

  const xScale = useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    return scaleTime()
      .domain(extent(data, xValue))
      .range([margin.left, innerWidth]);
  }, [data, innerWidth]);

  useEffect(() => {
    const selection = select(ref.current);
    marks({ selection, height, data, xScale, xValue });
  }, [width, height, data]);

  return <svg ref={ref} width={width} height={height}></svg>;
};
