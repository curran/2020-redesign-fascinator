import { select } from 'd3';
import { useRef, useEffect, useState } from 'react';
import { viz } from './viz';
import { useData } from './useData';
import { useDimensions } from './useDimensions';

export const App = () => {
  const ref = useRef();
  const data = useData();
  const { width, height } = useDimensions();

  useEffect(() => {
    viz({ selection: select(ref.current), width, height, data });
  }, [width, height, data]);

  return <svg ref={ref} width={width} height={height}></svg>;
};
