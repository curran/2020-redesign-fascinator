(function (d3) {
  'use strict';

  d3.json('./sampleWithTags.json').then((data) => {
    const fascinator = d3.select('.fascinator');
    fascinator.style('background', 'red');
  });
})(d3);
//# sourceMappingURL=bundle.js.map
