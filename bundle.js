(function (d3) {
  'use strict';

  const dataDir =  '.';

  const fascinator = d3.select('.fascinator');
  fascinator.style('background', 'red');

  d3.json(dataDir + '/sampleWithTags.json').then((data) => {
    fascinator.style('background', 'green');
    console.log(data.map(d => d.acf['go-live_date']));
  });

}(d3));
//# sourceMappingURL=bundle.js.map
