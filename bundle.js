(function (d3) {
  'use strict';

  const dataDir =  `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
    ;

  const fascinator = d3.select('.fascinator');

  let state = {};
  const setState = (newState) => {
    state = { ...state, ...newState };
    render();
  };

  const render = () => {
    console.log(state);
    const { data, width, height } = state;
    fascinator.style('background', data ? 'green' : 'red');
  };

  const setDimensions = () => {
    const div = fascinator.node();
    console.log(div);
    setState({
      width: div.clientWidth,
      height: div.clientHeight,
    });
  };

  setDimensions();
  window.addEventListener('resize', setDimensions);

  d3.json(dataDir + '/sampleWithTags.json').then((data) => {
    setState({
      data: data.map((d) => d.acf['go-live_date']),
    });
  });

}(d3));
//# sourceMappingURL=bundle.js.map
