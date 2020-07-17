(function (React$1, ReactDOM, d3) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;

  var radius = 100;

  var simulation = d3.forceSimulation().force('collide', d3.forceCollide(radius + 3));

  var viz = function (ref) {
    var selection = ref.selection;
    var width = ref.width;
    var height = ref.height;
    var data = ref.data;

    if (!data) { return; }

    var nodes = selection
      .selectAll('image')
      .data(data)
      .join(function (enter) { return enter
          .append('image')
          .attr('href', function (d) { return d.thumbnailURL; })
          .attr('height', radius); }
      );

    simulation.nodes(data);

    simulation
      .force('y', d3.forceY(height / 2).strength(1))
      .force('x', d3.forceX(width / 2).strength(0.05))
      //.force('x', forceX((d) => xScale(xValue(d))).strength(1))
      .on('tick', function () {
        nodes
          .attr('x', function (d) { return d.x - radius / 2; })
          .attr('y', function (d) { return d.y - radius / 2; });
      });
  };

  var dataDir =  ((window.location.origin) + "/wp-content/themes/stamen-2020/assets/data")
    ;

  var useData = function () {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      d3.json(dataDir + '/sampleWithTags.json').then(function (rawData) {
        setData(
          rawData.map(function (d) { return ({
            date: d.acf['go-live_date'],
            thumbnailURL: d.acf.thumbnail_image,
          }); })
        );
      });
    }, []);

    return data;
  };

  var fascinator = d3.select('.fascinator')
    .style('background-color', 'black')
    .node();

  var useDimensions = function () {
    var ref = React$1.useState({});
    var dimensions = ref[0];
    var setDimensions = ref[1];

    React$1.useEffect(function () {
      var updateDimensions = function () {
        setDimensions({
          width: fascinator.clientWidth,
          height: fascinator.clientHeight,
        });
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return function () { return window.removeEventListener('resize', updateDimensions); };
    }, []);

    return dimensions;
  };

  var App = function () {
    var ref = React$1.useRef();
    var data = useData();
    var ref$1 = useDimensions();
    var width = ref$1.width;
    var height = ref$1.height;

    React$1.useEffect(function () {
      viz({ selection: d3.select(ref.current), width: width, height: height, data: data });
    }, [width, height, data]);

    return React.createElement( 'svg', { ref: ref, width: width, height: height });
  };

  ReactDOM.render(React$1__default.createElement( App, null ), fascinator);

}(React, ReactDOM, d3));
//# sourceMappingURL=bundle.js.map
