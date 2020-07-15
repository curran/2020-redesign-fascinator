(function (d3) {
  'use strict';

  const radius = 50;

  const simulation = d3.forceSimulation().force('collide', d3.forceCollide(radius + 3));

  const viz = ({ selection, width, height, data }) => {
    if (!data) return;

    const circles = selection
      .selectAll('circle')
      .data(data)
      .join((enter) =>
        enter
          .append('circle')
          .attr('fill', '#ffff00')
          .attr('r', radius)
          .attr('cx', () => Math.random() * width)
          .attr('cy', () => Math.random() * height)
      );

    simulation.nodes(data);

    simulation
      .force('y', d3.forceY(height / 2).strength(1))
      .force('x', d3.forceX(width / 2).strength(0.05))
      //.force('x', forceX((d) => xScale(xValue(d))).strength(1))
      .on('tick', () => {
        circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });
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

  const dataDir =  `${window.location.origin}/wp-content/themes/stamen-2020/assets/data`
    ;

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
