import { select, json } from 'd3';
import { app } from './app';

// Set this to true to build for production, false during development.
const isProd = true;

const dataDir = isProd
  ? `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
  : '.';

const fascinator = select('.fascinator');

let state = {};
const setState = (newState) => {
  state = { ...state, ...newState };
  app({ ...state, selection: fascinator });
};

const setDimensions = () => {
  const div = fascinator.node();
  setState({
    width: div.clientWidth,
    height: div.clientHeight,
  });
};

setDimensions();
window.addEventListener('resize', setDimensions);

json(dataDir + '/sampleWithTags.json').then((data) => {
  setState({
    data: data.map((d) => ({
      date: d.acf['go-live_date'],
    })),
  });
});
