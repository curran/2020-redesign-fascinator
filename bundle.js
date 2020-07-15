(function (d3) {
  'use strict';

  const fascinator = d3.select('.fascinator');
  fascinator.style('background', 'red');

  d3.json(
    `${window.location.origin}/wp-content/themes/stamen-2020/assets/data/sampleWithTags.json`
  ).then((data) => {
    fascinator.style('background', 'green');
    console.log(data);
  });

}(d3));
//# sourceMappingURL=bundle.js.map
