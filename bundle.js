(function (d3) {
  'use strict';

  const app = ({ selection, data, width, height }) => {
    selection.style('background', data ? 'green' : 'red');

    const svg = selection
      .selectAll('svg')
      .data([1])
      .join(
        (enter) => enter.append('svg'),
        (update) => update
      )
      .attr('width', width)
      .attr('height', height);
  };

  const dataDir =  '.';

  const fascinator = d3.select('.fascinator');

  let state = {};
  const setState = (newState) => {
    state = { ...state, ...newState };
    app({ ...state, selection: fascinator });
  };

  const setDimensions = () => {
    const div = fascinator.node();
    setState({
      width: div.clientWidth,
      height: div.clientHeight,
    });
  };

  setDimensions();
  window.addEventListener('resize', setDimensions);

  d3.json(dataDir + '/sampleWithTags.json').then((data) => {
    setState({
      data: data.map((d) => ({
        date: d.acf['go-live_date'],
      })),
    });
  });

}(d3));
//# sourceMappingURL=bundle.js.map
