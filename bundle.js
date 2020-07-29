(function (React$1, ReactDOM, d3) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;

  // The images generated are ${size}px by ${size}px;
  var size = 70;

  var dataDir =  'https://cdn.jsdelivr.net/gh/stamen/2020-redesign-fascinator@master/data'
    ;

  // This is the output from running data/scrape.js.
  var dataFile = 'fascinatorData.json';

  var parseDate = d3.timeParse('%m/%d/%Y');

  var useData = function () {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      d3.json((dataDir + "/" + dataFile)).then(function (rawData) {
        setData(
          rawData.map(function (d) { return (Object.assign({}, d,
            {date: parseDate(d.go_live_date)})); })
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

  var yearFormat = d3.timeFormat('%Y');

  var tickLabelYOffset = 30;
  var titleLabelYOffset = 10;

  var Tooltip = function (ref) {
    var height = ref.height;
    var xValue = ref.xValue;
    var hoveredEntry = ref.hoveredEntry;

    if (!hoveredEntry) { return null; }

    // Get exactly 1px wide lines that fall on the pixel exactly.
    var x = Math.round(hoveredEntry.x) + 0.5;

    var yearLabel = yearFormat(xValue(hoveredEntry));
    var titleLabel = hoveredEntry.post_title;

    return (
      React.createElement( 'g', { transform: ("translate(" + x + ",0)") },
        React.createElement( 'line', { y2: height - tickLabelYOffset * 2, stroke: "yellow" }),
        React.createElement( 'g', { transform: ("translate(0," + (height - tickLabelYOffset) + ")") },
          React.createElement( 'text', {
            textAnchor: "middle", alignmentBaseline: "middle", fontFamily: "HelveticaNeue, sans-serif", fontSize: "24px", fill: "yellow" },
            yearLabel
          ),
          React.createElement( 'text', {
            y: titleLabelYOffset, textAnchor: "middle", alignmentBaseline: "middle", fontFamily: "HelveticaNeue, sans-serif", fontSize: "20px", fill: "yellow" },
            titleLabel
          )
        )
      )
    );
  };

  var simulation = d3.forceSimulation().force('collide', d3.forceCollide(size / 2));

  // This is the portion where D3 takes over DOM manipulation.
  var marks = function (ref) {
    var selection = ref.selection;
    var height = ref.height;
    var data = ref.data;
    var xScale = ref.xScale;
    var xValue = ref.xValue;
    var onMouseEnter = ref.onMouseEnter;
    var onMouseLeave = ref.onMouseLeave;

    var nodes = selection
      .selectAll('image')
      .data(data)
      .join(function (enter) { return enter
          .append('image')
          .attr('href', function (d) { return d.thumbnailDataURL; })
          .attr('height', size)
          .on('mouseenter', function (d) { return onMouseEnter(d); })
          .on('mouseleave', onMouseLeave); }
      );

    simulation.nodes(data);

    simulation
      .force('y', d3.forceY(height / 2))
      .force(
        'x',
        d3.forceX(function (d) { return xScale(xValue(d)); })
      )
      .on('tick', function () {
        nodes.attr('x', function (d) { return d.x - size / 2; }).attr('y', function (d) { return d.y - size / 2; });
      });
  };

  var Marks = function (ref$1) {
    var height = ref$1.height;
    var data = ref$1.data;
    var xScale = ref$1.xScale;
    var xValue = ref$1.xValue;
    var onMouseEnter = ref$1.onMouseEnter;
    var onMouseLeave = ref$1.onMouseLeave;

    var ref = React$1.useRef();

    React$1.useEffect(function () {
      var selection = d3.select(ref.current);
      marks({
        selection: selection,
        height: height,
        data: data,
        xScale: xScale,
        xValue: xValue,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
      });
    }, [height, data, xScale, xValue]);

    return React.createElement( 'g', { ref: ref });
  };

  var xValue = function (d) { return d.date; };

  var margin = { left: 100, right: 200 };

  var Viz = function (ref) {
    var width = ref.width;
    var height = ref.height;
    var data = ref.data;

    var xScale = React$1.useMemo(function () {
      var innerWidth = width - margin.left - margin.right;
      return d3.scaleTime().domain(d3.extent(data, xValue)).range([0, innerWidth]);
    }, [data, innerWidth]);

    var ref$1 = React$1.useState(null);
    var hoveredEntry = ref$1[0];
    var setHoveredEntry = ref$1[1];

    var handleMouseEnter = React$1.useCallback(
      function (d) {
        setHoveredEntry(d);
      },
      [setHoveredEntry]
    );

    var handleMouseLeave = React$1.useCallback(function () {
      setHoveredEntry(null);
    }, [setHoveredEntry]);

    return (
      React.createElement( 'svg', { width: width, height: height },
        React.createElement( 'g', { transform: ("translate(" + (margin.left) + ",0)") },
          React.createElement( Tooltip, { height: height, xValue: xValue, hoveredEntry: hoveredEntry }),
          React.createElement( Marks, {
            data: data, height: height, xScale: xScale, xValue: xValue, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave })
        )
      )
    );
  };

  var App = function () {
    var data = useData();
    var ref = useDimensions();
    var width = ref.width;
    var height = ref.height;
    return data && width && height ? (
      React.createElement( Viz, { width: width, height: height, data: data })
    ) : null;
  };

  ReactDOM.render(React$1__default.createElement( App, null ), fascinator);

}(React, ReactDOM, d3));
//# sourceMappingURL=bundle.js.map
