import { useState, useEffect } from 'react';
import { fascinator } from './fascinator';

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({});

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: fascinator.clientWidth,
        height: fascinator.clientHeight,
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};
