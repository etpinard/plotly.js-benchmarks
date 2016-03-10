'use strict';

var d3 = require('d3');
var run = require('../lib/run');

var CLASS_NAME = 'container';

// set the sample size
var SAMPLE_SIZE = 100;

// set the number of points
var Npts = 100;

// set the number of traces
var Ntraces = 10;

var specs = [{

  // http://bl.ocks.org/etpinard/fb082e67cd821b4362ef
  name: 'flat + sort',

  getVersion: getVersion,

  setup: setup,

  beforeEach: createDiv,

  bench: function(benchObj, setupData) {
    benchObj.startTimer();

    plotFlatSort(setupData[0]);
    plotFlatSort(setupData[1]);

    benchObj.stopTimer();
  },

  afterEach: destroyDiv

}, {

  // http://bl.ocks.org/etpinard/c163b8bee7d3bcb6a31f
  name: 'nested + order',

  getVersion: getVersion,

  setup: setup,

  beforeEach: createDiv,

  bench: function(benchObj, setupData) {
    benchObj.startTimer();

    plotNestedOrder(setupData[0]);
    plotNestedOrder(setupData[1]);

    benchObj.stopTimer();
  },

  afterEach: destroyDiv

}, {

  name: 'flat + remove all',

  getVersion: getVersion,

  setup: setup,

  beforeEach: createDiv,

  bench: function(benchObj, setupData) {
    benchObj.startTimer();

    plotFlatRemoveAll(setupData[0]);
    plotFlatRemoveAll(setupData[1]);

    benchObj.stopTimer();
  },

  afterEach: destroyDiv

}];

function plotFlatSort(data) {
  var traces = d3.select('.' + CLASS_NAME)
    .data(data);

  traces.enter().append('div')
    .classed('trace', true);

  traces.exit().remove();

  traces.each(function(pts) {
    var trace = d3.select(this);

    var modeData = [];
    if(hasLines(pts)) modeData.push('lines');
    if(hasMarkers(pts)) modeData.push('markers');

    var modes = trace.selectAll('div.mode')
      .data(modeData, function(d) { return d; });

    modes.enter().append('div')
      .classed('mode', true);

    // VERY IMPORTANT mode divs are reordered
    modes.order();
    modes.exit().remove();

    modes.each(function(val) {
      var mode = d3.select(this);

      switch(val) {

        case 'lines':
          var lines = mode.selectAll('p.line')
            .data([makeLine(pts)]);

          lines.enter().append('p')
            .classed('line', true);

          lines.text(function(d) { return d; });

          lines.exit().remove();
          break;

        case 'markers':
          var markers = mode.selectAll('p.marker')
            .data(pts);

          markers.enter().append('p')
            .classed('marker', true);

          markers.text(makeMarker);

          markers.exit().remove();
          break;

      }
    });

  });
}

function plotNestedOrder(data) {
  var traces = d3.select('.' + CLASS_NAME)
    .data(data);

  traces.enter().append('div')
    .classed('trace', true);

  traces.exit().remove();

  traces.each(function(pts) {
    var trace = d3.select(this);

    var lineData = hasLines(pts) ?
      [{ order: 0, path: makeLine(pts) }] :
      [];
    var lines = trace.selectAll('p.line')
      .data(lineData);

    lines.enter().append('p')
      .classed('line', true);

    lines.text(function(d) { return d.path; });

    lines.exit().remove();

    var markerData = hasMarkers(pts) ? pts : [];
    var markers = trace.selectAll('p.marker')
      .data(markerData);

    markers.enter().append('p')
      .classed('marker', true);

    markers.each(function(pt) { pt.order = 1; });

    markers.text(makeMarker);

    markers.exit().remove();

    // reorder the inner nodes
    trace.selectAll('*').sort(function(a, b) {
      return a.order - b.order;
    });

  });
}

function plotFlatRemoveAll(data) {
  var traces = d3.select('.' + CLASS_NAME)
    .data(data);

  traces.enter().append('div')
    .classed('trace', true);

  traces.exit().remove();

  // BRUTE FORCE
  traces.selectAll('*').remove();

  traces.each(function(pts) {
    var trace = d3.select(this);

    if(hasLines(pts)) {
      var lines = trace.selectAll('p.line')
        .data([makeLine(pts)]);

      lines.enter().append('p')
        .classed('line', true);

      lines.text(function(d) { return d; });
    }

    if(hasMarkers(pts)) {
      var markers = trace.selectAll('p.marker')
        .data(pts);

      markers.enter().append('p')
        .classed('marker', true);

      markers.text(makeMarker);

      markers.exit().remove();
    }
  });
}

function setup() {
  function makePts() {
    var pts = new Array(Npts);

    for(var i = 0; i < Npts; i++) {
      pts[i] = { x: i, y: i+1 };
    }

    return pts;
  }

  function makeTraces(mode) {
    var traces = new Array(Ntraces);

    for(var i = 0; i < Ntraces; i++) {
      traces[i] = makePts();
      traces[i][0].trace = { mode: mode };
    }

    return traces;
  }

  var calcdata0 = makeTraces('markers');
  var calcdata1 = makeTraces('markers+lines');

  return [calcdata0, calcdata1];
}

function getVersion() { return d3.version; }

function createDiv() {
  d3.select('body').append('div')
    .classed(CLASS_NAME, true);
}

function destroyDiv() {
  d3.select('.' + CLASS_NAME).remove();
}

function hasLines(pts) {
  return pts[0].trace.mode.indexOf('lines') !== -1;
}

function hasMarkers(pts) {
  return pts[0].trace.mode.indexOf('markers') !== -1;
}

function makeLine(pts) {
  return 'line: ' + pts.map(function(pt) {
    return '(' + pt.x + ',' + pt.y + ')';
   }).join('-');
}

function makeMarker(pt) {
  return 'marker: (' + pt.x + ',' + pt.y + ')';
}

var suite = {
  meta: {},
  opts: {
    sampleSize: SAMPLE_SIZE,
    hideLogOnCycle: true
  },
  specs: specs
};

run(suite);
