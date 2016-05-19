'use strict';

var Plotly = require('plotly.js');
var run = require('../../lib/run');

// make sure to run ./get-data.js first !!!
var fig = require('./data.json');

// set the sample size
var SAMPLE_SIZE = 10;

run({

meta: {},

opts: { sampleSize: SAMPLE_SIZE },

specs: [{
  name: 'mesh3d',

  getVersion: function() {
    return Plotly.version;
  },

  setup: function() {
    var div = document.createElement('div');
    div.id = 'graph';

    document.body.appendChild(div);

    return { gd: div };
  },

  beforeEach: function() {},

  bench: function(benchObj, setupData) {
      benchObj.startTimer();

      Plotly.plot(setupData.gd, fig.data, fig.layout).then(function() {
        benchObj.stopTimer();
      });
  },

  afterEach: function(setupData) {
    Plotly.purge(setupData.gd);
  }

}]

});
