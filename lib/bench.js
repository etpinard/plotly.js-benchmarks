'use strict';


function Bencher(karma, suite) {
  this.karma = karma;
  this.meta = suite.meta;

  var specs = this.specs = suite.specs;
  var opts = this.opts = suite.opts;

  this.pendingRuns = specs.length * opts.sampleSize;
  this.results = [];
  this.stack = [];
  this.index = 0;
}

Bencher.prototype.run = function() {
  this.karma.info({total: this.specs.length});

  for(var i=0; i < this.specs.length; i++) {
    this.stack.push(new BenchObj(this, this.specs[i], this.opts));
  }

  this.stack[this.index].run();
};


function BenchObj(bencher, spec, opts) {
  this.bencher = bencher;
  this.spec = spec;
  this.opts = opts;
  this.time0 = null;
  this.time1 = null;
  this.sample = [];

  if(isFunction(this.spec.setup)) {
    this.setupData = this.spec.setup(this);
  }
}

BenchObj.prototype.run = function() {
  this.spec.bench(this, this.setupData);
};

BenchObj.prototype.startTimer = function() {
  if(isFunction(this.spec.beforeEach)) {
    this.spec.beforeEach();
  }

  this.time0 = performance.now();
};

BenchObj.prototype.stopTimer = function() {
  var bencher = this.bencher;
  var spec = this.spec;
  var sample = this.sample;

  this.time1 = performance.now();

  if(isFunction(this.spec.afterEach)) {
    spec.afterEach(this.setupData);
  }

  var delta = this.time1 - this.time0;
  this.sample.push(delta);

  if(!bencher.opts.hideLogOnCycle) {
    console.log(spec.name + ': ' + delta + ' ms');
  }

  if(sample.length === this.opts.sampleSize) {
    var benchmark = {
      name: spec.name,
      version: isFunction(spec.getVersion) ? spec.getVersion() : '',
      mean: calcMean(sample),
      std: calcStd(sample),
      sample: sample
    };

    bencher.karma.result({
      success: true,
      benchmark: benchmark,
      meta: bencher.meta,
      opts: bencher.opts
    });
    bencher.results.push(benchmark);

    // TODO implement a teardown step?

    if(++bencher.index < bencher.stack.length) {
      bencher.stack[bencher.index].run();
    }
  }
  else this.run();

  if(!--bencher.pendingRuns) {
    bencher.karma.complete({});
  }
};

function calcMean(sample) {
  var n = sample.length;
  var sum = 0;

  for(var i=0; i<n; i++) {
    sum += sample[i];
  }

  return sum / n;
}

function calcStd(sample) {
  var n = sample.length;

  if(n === 1) return 0;

  var mean = calcMean(sample);
  var ssq = 0;

  for(var i=0; i<n; i++) {
    ssq += Math.pow(sample[i] - mean, 2);
  }

  return Math.sqrt(ssq / (n-1));
}

function isFunction(fn) {
   var getType = {};
   return fn && getType.toString.call(fn) === '[object Function]';
}

module.exports = function createBencher(karma, specs, opts) {
  return new Bencher(karma, specs, opts);
};
