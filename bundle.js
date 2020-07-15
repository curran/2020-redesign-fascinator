(function (d3) {
  'use strict';

  const dataDir =  `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
    ;

  const fascinator = d3.select('.fascinator');
  fascinator.style('background', 'red');

  d3.json(dataDir + '/sampleWithTags.json').then((data) => {
    fascinator.style('background', 'green');
    console.log(data);
  });

}(d3));
//# sourceMappingURL=bundle.js.map
