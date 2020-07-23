import { useState, useEffect } from 'react';
import { json } from 'd3';

// Set this to true to build for production, false during development.
const isProd = false;

const dataDir = isProd
  ? 'https://cdn.jsdelivr.net/gh/stamen/2020-redesign-fascinator@master/data'
  : '/data';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(dataDir + '/sampleWithTags.json').then((rawData) => {
      setData(
        rawData.map((d) => ({
          date: d.go_live_date,
          thumbnailURL: d.thumbnail_image,
        }))
      );
    });
  }, []);

  return data;
};
