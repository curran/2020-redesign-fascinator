(function (React$1, ReactDOM, d3) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  var version = "1.7.0";

  // The images generated are ${size}px by ${size}px;
  var size = 70;

  // Give 1 extra pixel for the stroke (so it doesn't get cut off at the edges).
  var radius = size / 2 - 2;

  var hoveredRadius = radius * 2;
  var hoveredSize = size * 2;

  var dataDir =  ("https://cdn.jsdelivr.net/gh/stamen/2020-redesign-fascinator@" + version + "/data")
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
          rawData
            .map(function (d) {
              var rand = Math.random() + 0.5;
              return Object.assign({}, d,
                {date: parseDate(d.go_live_date),
                size: size * rand,
                radius: radius * rand});
            })
            .sort(function (a, b) { return d3.ascending(a.date, b.date); })
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
      return function () { return window.removeEventListener(
          'resize',
          updateDimensions
        ); };
    }, []);

    return dimensions;
  };

  var yearFormat = d3.timeFormat('%Y');

  // The distance from the bottom to the end of the line.
  var tickLineYOffset = 60;

  // Distance from the bottom to the year label.
  var tickLabelYOffset = 40;

  // Distance from the bottom to the title label.
  var titleLabelYOffset = 13;

  // The amount by which the text is moved to the left of the line.
  var textXOffset = -29;
  var textXOffsetRight = 29;

  // Unique ID per entry.
  var key = function (d) { return d.ID; };

  // Get exactly 1px wide lines that fall on the pixel exactly.
  var xExact = function (d) { return Math.round(d.x) + 0.5; };

  // The number of milliseconds for the line animation.
  var lineTransitionDuration = 1000;

  // The number of milliseconds for the text animation.
  var textTransitionDuration = 400;

  // The number of milliseconds before the end of the line transition
  // that the text transition starts.
  var textTransitionAnticipation = 200;

  var Tooltip = function (ref$1) {
    var width = ref$1.width;
    var height = ref$1.height;
    var xValue = ref$1.xValue;
    var data = ref$1.data;
    var hoveredEntry = ref$1.hoveredEntry;
    var blackStroke = ref$1.blackStroke;
    var text = ref$1.text;

    var ref = React$1.useRef();

    React$1.useEffect(function () {
      var g = d3.select(ref.current);

      g.selectAll('line')
        .data(data, key)
        .join(
          function (enter) { return enter.append('line').attr('stroke', 'yellow'); },
          function (update) { return update
              .attr('x1', xExact)
              .attr('x2', xExact)
              .attr('y1', function (d) { return d.y; })
              .attr('y2', function (d) { return d.y; })
              .call(function (update) { return update
                  .transition()
                  .duration(lineTransitionDuration)
                  .attr('y2', function (d) { return d === hoveredEntry
                      ? height - tickLineYOffset
                      : d.y; }
                  ); }
              ); }
        );

      var textFill = blackStroke ? 'none' : 'yellow';
      var textStroke = blackStroke ? 'black' : 'none';

      var labels = function (d) { return [
        {
          text: yearFormat(xValue(d)),
          x: d.x + textXOffset,
          y: height - tickLabelYOffset,
          fontSize: '26px',
          textAnchor: 'start',
        },
        {
          text: hoveredEntry.post_title,
          x:
            d.x > innerWidth / 2
              ? d.x + textXOffsetRight
              : d.x + textXOffset,
          y: height - titleLabelYOffset,
          fontSize: '18px',
          textAnchor: d.x > innerWidth / 2 ? 'end' : 'start',
        } ]; };

      g.selectAll('text')
        .data(
          text && hoveredEntry ? labels(hoveredEntry) : []
        )
        .join(
          function (enter) { return enter
              .append('text')
              .attr('alignment-baseline', 'middle')
              .attr('text-anchor', function (d) { return d.textAnchor; })
              .attr(
                'font-family',
                'HelveticaNeue, sans-serif'
              )
              .attr('font-size', function (d) { return d.fontSize; })
              .attr('fill', textFill)
              .attr('stroke', textStroke)
              .attr('stroke-width', 4)
              .text(function (d) { return d.text; })
              .attr('x', function (d) { return d.x; })
              .attr('y', function (d) { return d.y; })
              .attr('opacity', 0); },
          function (update) { return update.call(function (update) { return update
                .transition()
                .delay(textTransitionDuration)
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .text(function (d) { return d.text; }); }
            ); },
          function (exit) { return exit.call(function (exit) { return exit
                .transition('opacity')
                .duration(textTransitionDuration)
                .attr('opacity', 0)
                .remove(); }
            ); }
        )
        .transition('opacity')
        .delay(
          lineTransitionDuration - textTransitionAnticipation
        )
        .duration(textTransitionDuration)
        .attr('opacity', 1);
    }, [
      data,
      hoveredEntry,
      blackStroke,
      width,
      height,
      text,
      xValue ]);

    return (
      React.createElement( 'g', { style: { pointerEvents: 'none' }, ref: ref })
    );
  };

  // Pixels gap to leave between circles.
  var collidePadding = 3;

  var simulation = d3.forceSimulation();

  // This is the portion where D3 takes over DOM manipulation.
  var marks = function (ref) {
    var selection = ref.selection;
    var height = ref.height;
    var data = ref.data;
    var xScale = ref.xScale;
    var xValue = ref.xValue;
    var onMouseEnter = ref.onMouseEnter;
    var onMouseLeave = ref.onMouseLeave;
    var hoveredEntry = ref.hoveredEntry;

    // Each node has a parent group that listens for mouse events.
    var nodesUpdate = selection
      .selectAll('.node')
      .data(data);
    var nodesEnter = nodesUpdate
      .enter()
      .append('g')
      .attr('class', 'node');
    var nodes = nodesUpdate.merge(nodesEnter);

    // Each parent group contains an image.
    var imagesUpdate = nodes.select('image');
    var imagesEnter = nodesEnter
      .append('image')
      .attr('href', function (d) { return d.thumbnailDataURL; });
    imagesUpdate
      .merge(imagesEnter)
      .transition()
      .attr(
        'x',
        function (d) { return -(d === hoveredEntry ? hoveredSize : d.size) / 2; }
      )
      .attr(
        'y',
        function (d) { return -(d === hoveredEntry ? hoveredSize : d.size) / 2; }
      )
      .attr('width', function (d) { return d === hoveredEntry ? hoveredSize : d.size; }
      )
      .attr('height', function (d) { return d === hoveredEntry ? hoveredSize : d.size; }
      );

    // Each parent group contains a link that opens the work page.
    var linksUpdate = nodesUpdate.select('a');
    var linksEnter = nodesEnter
      .append('a')
      .attr(
        'href',
        function (d) { return ((window.location.origin) + "/work/" + (d.post_name)); }
      )
      .attr('target', '_blank')
      .attr('rel', 'noopener noreferrer')
      .style('pointer-events', 'all');

    // Each link contains a circle that intercepts mouse events
    // and provides the stroke around the circularly masked images.
    var circlesUpdate = linksUpdate.select('circle');
    var circlesEnter = linksEnter
      .append('circle')
      .attr('fill', 'none');
    circlesUpdate
      .merge(circlesEnter)
      .on('mouseenter', function (d) { return onMouseEnter(d); })
      .on('mouseleave', onMouseLeave)
      .transition()
      .attr('stroke', function (d) { return d === hoveredEntry ? 'yellow' : 'white'; }
      )
      .attr('stroke-width', function (d) { return d === hoveredEntry ? 2 : 1; }
      )
      .attr('r', function (d) { return d === hoveredEntry ? hoveredRadius : d.radius; }
      );

    // Update the collide force to know about the hovered entry.
    simulation
      .nodes(data)
      .force(
        'collide',
        d3.forceCollide(function (d) { return d.radius + collidePadding; })
      )
      .force('charge', d3.forceManyBody())
      .velocityDecay(0.1)
      .force('y', d3.forceY(height / 2))
      .force(
        'x',
        d3.forceX(function (d) { return xScale(xValue(d)); })
      )
      .on('tick', function () {
        nodes.attr(
          'transform',
          function (d) { return ("translate(" + (d.x) + "," + (d.y) + ")"); }
        );
      })
      .alphaTarget(hoveredEntry ? 0.01 : 0)
      .restart();
  };

  var Marks = function (ref$1) {
    var height = ref$1.height;
    var data = ref$1.data;
    var xScale = ref$1.xScale;
    var xValue = ref$1.xValue;
    var onMouseEnter = ref$1.onMouseEnter;
    var onMouseLeave = ref$1.onMouseLeave;
    var hoveredEntry = ref$1.hoveredEntry;

    var ref = React$1.useRef();

    // Compute the size of things based on the hovered entry.
    // Better to do it in one place like this instead of
    // duplicated across all logic that depends on it.
    React$1.useEffect(function () {
      data.forEach(function (d) {
        // If the entry is the hovered entry,
        // make it larger and
        // fix it so it doesn't move.
        if (d === hoveredEntry) {
          d.fx = d.x;
          d.fy = d.y;
        } else {
          d.fx = null;
          d.fy = null;
        }
      });
    }, [data, hoveredEntry]);

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
        hoveredEntry: hoveredEntry,
      });
    }, [
      height,
      data,
      xScale,
      xValue,
      hoveredEntry,
      onMouseEnter,
      onMouseLeave ]);

    React$1.useEffect(function () {
      data.forEach(function (d) {
        d.fx = 3000;
        d.fy = height / 2;
        d.vx = 0;
        d.vy = 0;
      });
      var i = 0;
      var revealPoint = function () {
        data[i].fx = null;
        data[i].fy = null;
        i++;
        if (i < data.length) {
          simulation.alphaTarget(0.05);
          setTimeout(revealPoint, 200);
        } else {
          simulation.alphaTarget(0.0);
        }
      };
      revealPoint();
    }, [data, height]);

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
      return d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);
    }, [data, width]);

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
          React.createElement( Tooltip, {
            width: width, height: height, xValue: xValue, data: data, hoveredEntry: hoveredEntry }),
          React.createElement( Marks, {
            data: data, height: height, xScale: xScale, xValue: xValue, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, hoveredEntry: hoveredEntry }),
          React.createElement( Tooltip, {
            width: width, height: height, xValue: xValue, hoveredEntry: hoveredEntry, text: true, blackStroke: true }),
          React.createElement( Tooltip, {
            width: width, height: height, xValue: xValue, hoveredEntry: hoveredEntry, text: true })
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

  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), fascinator);

}(React, ReactDOM, d3));
//# sourceMappingURL=bundle.js.map
