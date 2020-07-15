import { select, json } from 'd3';

// Set this to true to build for production, false during development.
const isProd = false;

const dataDir = isProd
  ? `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
  : '.';

const fascinator = select('.fascinator');

let state = {};
const setState = (newState) => {
  state = { ...state, ...newState };
  render();
};

const render = () => {
  console.log(state);
  const { data, width, height } = state;
  fascinator.style('background', data ? 'green' : 'red');

  const svg = fascinator
    .selectAll('svg')
    .data([1])
    .join(
      (enter) => enter.append('svg'),
      (update) => update
    )
    .attr('width', width)
    .attr('height', height);
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
    data: data.map((d) => d.acf['go-live_date']),
  });
});
