import { select, json } from 'd3';

// Set this to true to build for production, false during development.
const isProd = true;

const dataDir = isProd
  ? `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
  : '.';

const fascinator = select('.fascinator');
fascinator.style('background', 'red');

json(dataDir + '/sampleWithTags.json').then((data) => {
  fascinator.style('background', 'green');
  console.log(data);
});
