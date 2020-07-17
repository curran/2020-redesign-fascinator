import { useState, useEffect } from 'react';
import { json } from 'd3';

// Set this to true to build for production, false during development.
const isProd = true;

const dataDir = isProd
  ? `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
  : '.';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(dataDir + '/sampleWithTags.json').then((rawData) => {
      setData(
        rawData.map((d) => ({
          date: d.acf['go-live_date'],
          thumbnailURL: d.acf.thumbnail_image
        }))
      );
    });
  }, []);

  return data;
};
