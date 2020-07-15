(function (d3) {
  'use strict';

  const viz = ({ selection, width, height, data }) => {
    selection
      .selectAll('circle')
      .data(data)
      .join((enter) =>
        enter
          .append('circle')
          .attr('fill', '#ffff00')
          .attr('r', 30)
          .attr('cx', () => Math.random() * width)
          .attr('cy', () => Math.random() * height)
      );
  };

  const app = ({ selection, width, height, data }) => {
    selection.style('background', 'black');

    const svg = selection
      .selectAll('svg')
      .data([1])
      .join((enter) => enter.append('svg'))
      .attr('width', width)
      .attr('height', height);

    viz({ selection: svg, width, height, data });
  };

  const dataDir = '.';

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
})(d3);
//# sourceMappingURL=bundle.js.map
