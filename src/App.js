import { useData } from './useData';
import { useDimensions } from './useDimensions';
import { Viz } from './Viz';

export const App = () => {
  const data = useData();
  const { width, height } = useDimensions();
  return data && width && height ? (
    <Viz width={width} height={height} data={data} />
  ) : null;
};
