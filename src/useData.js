import { useState, useEffect } from 'react';
import { json, timeParse, ascending } from 'd3';
import { isProd, version, size, radius } from './constants';

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
        rawData
          .map((d) => {
            const rand = Math.random() + 0.5;
            return {
              ...d,
              date: parseDate(d.go_live_date),
              size: size * rand,
              radius: radius * rand,
            };
          })
          .sort((a, b) => ascending(a.date, b.date))
      );
    });
  }, []);

  return data;
};
