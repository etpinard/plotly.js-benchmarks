'use strict';

var Plotly = require('plotly.js');
var Lib = require('plotly.js/src/lib');
var d3 = Plotly.d3;

var run = require('../../lib/run');

// set the sample size
var SAMPLE_SIZE = 100;

var DATA = [10, 20];


run({

meta: {},

opts: {
  sampleSize: SAMPLE_SIZE,
  hideLogOnCycle: true
},

specs: [{
  name: 'd3 set-translate',

  getVersion: function() {
    return d3.version;
  },

  setup: setup,
  beforeEach: beforeEach,
  afterEach: afterEach,

  bench: function(benchObj) {
      benchObj.startTimer();

      d3.select('g').attr('transform');

      d3.select('g')
        .attr('transform',
          'translate(' + DATA[0] + ',' + DATA[1] + ')');

      benchObj.stopTimer();
  }

}, {
  name: 'Plotly Lib.setTranslate',

  getVersion: function() {
    return Plotly.version;
  },

  setup: setup,
  beforeEach: beforeEach,
  afterEach: afterEach,

  bench: function(benchObj) {
      benchObj.startTimer();

      var node = d3.select('g').node();

      Lib.getTranslate(node);

      Lib.setTranslate(node, DATA[0], DATA[1]);

      benchObj.stopTimer();
  }

}]

});

function setup() {
  var svg = d3.select('body').append('svg');

  return { svg: svg };
}

function beforeEach(setupData) {
  setupData.svg.append('g');
}

function afterEach(setupData) {
  setupData.svg.select('g').remove();
}
