import { select, json } from 'd3';

json('./sampleWithTags.json').then((data) => {
  const fascinator = select('.fascinator');
  fascinator.style('background', 'red');
});
