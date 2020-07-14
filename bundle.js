(function (d3) {
  'use strict';

  const fascinator = d3.select('.fascinator');
  fascinator.style('background', 'red');

  d3.json('./sampleWithTags.json').then((data) => {
    fascinator.style('background', 'green');
    console.log(data);
  });

}(d3));
//# sourceMappingURL=bundle.js.map
