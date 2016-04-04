'use strict';

var run = require('../lib/run');

// set the sample size
var SAMPLE_SIZE = 100;

var STRINGS = [
    '34', '123456789', '0', '0.1', '10',
//     '15s', '1, 000', '011', '45',
//     '4512', '459', '8348', '3418', '2342.3', '4.5', '34134343', '341234034',
//     '3434', '340', '3481', '3869', '38906', '4', '1', '2', '45', '48', '38.3', 'xx',
//     '341,430,341'
];

var dummy;

function loop(fn) {
    for(var i = 0; i < STRINGS.length; i++) {
        dummy = fn(STRINGS[i]);
    }
}

var specs = [{

  name: 'parseInt',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return parseInt(str, 10);
    }

    loop(fn);

    benchObj.stopTimer();
  }

}, {

  name: 'parseFloat',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return parseFloat(str);
    }

    loop(fn);

    benchObj.stopTimer();
  }

}, {

  name: 'Number(str)',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return Number(str);
    }

    loop(fn);

    benchObj.stopTimer();
  }

}, {

  name: 'str << 0',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return str << 0;
    }

    loop(fn);

    benchObj.stopTimer();
  }

}, {

  name: '+str',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return +str;
    }

    loop(fn);

    benchObj.stopTimer();
  }

}, {

  name: 'str * 1',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return str * 1;
    }

    loop(fn);

    benchObj.stopTimer();
  }

}, {
  name: 'str - 0',

  bench: function(benchObj) {
    benchObj.startTimer();

    function fn(str) {
        return str - 0;
    }

    loop(fn);

    benchObj.stopTimer();
  }

}];

var suite = {
  meta: {},
  opts: {
    sampleSize: SAMPLE_SIZE,
    hideLogOnCycle: true
  },
  specs: specs
};

run(suite);
