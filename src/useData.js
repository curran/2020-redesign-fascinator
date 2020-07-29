import { useState, useEffect } from 'react';
import { json, timeParse } from 'd3';
import { isProd, version } from './constants';

const dataDir = isProd
  ? `https://cdn.jsdelivr.net/gh/stamen/2020-redesign-fascinator@${version}/data`
  : '/data';

// This is the output from running data/scrape.js.
const dataFile = 'fascinatorData.json';

const parseDate = timeParse('%m/%d/%Y');

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(`${dataDir}/${dataFile}`).then((rawData) => {
      setData(
        rawData.map((d) => ({
          ...d,
          date: parseDate(d.go_live_date),
        }))
      );
    });
  }, []);

  return data;
};
