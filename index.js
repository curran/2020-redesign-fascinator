import { select, json } from 'd3';

const fascinator = select('.fascinator');
fascinator.style('background', 'red');

json('./sampleWithTags.json').then((data) => {
  fascinator.style('background', 'green');
  console.log(data);
});
