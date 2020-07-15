import { select, json } from 'd3';

const fascinator = select('.fascinator');
fascinator.style('background', 'red');

json(
  `${window.location.origin}/wp-content/themes/stamen-2020/assets/data/sampleWithTags.json`
).then((data) => {
  fascinator.style('background', 'green');
  console.log(data);
});
