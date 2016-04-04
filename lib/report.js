var fs = require('fs');
var path  = require('path');

var reporter = function(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  var suite = config.suiteName;
  var pathToOut = path.join(__dirname, '..', 'results', suite + '.json');
  var pathToOutShort = path.join('results', suite + '.json');

  var meta = {};
  var opts = {};
  var results = [];

  this.specSuccess = function(browser, result) {
    // same for all specs
    meta = result.meta;
    opts = result.opts;

    result.benchmark.browser = browser.name;
    results.push(result.benchmark);
  };

  this.onRunComplete = function(browser, info) {
    results = sortResults(results);

    var standings = formatStandings(results, opts, config);
    var formattedResults = formatResults(results, opts, config, meta);

    fs.writeFileSync(pathToOut, formattedResults);

    if(!opts.hideStandings) {
        this.write('\n' + standings + '\n');
        this.write('\nFull results written in ./' + pathToOutShort + '\n');
    }
  };

};

function sortResults(results) {
  results = results.sort(function(a, b) {
    return a.mean - b.mean;
  });

  return results;
}

function formatStandings(results, opts, config) {
  var showBrowser = config.browsers.length > 1;

  return 'Standings (after ' + opts.sampleSize + ' cycles):\n' +
    results.map(function(r) {
      return [
        '-',
        r.name,
        (showBrowser ? '[' + r.browser + ']:' : ':'),
        r.mean,
        '+/-',
        r.std ,
        'ms'
      ].join(' ')
    }).join('\n');
}

function formatResults(results, opts, config, meta) {
  meta.suite = config.suiteName;
  meta.date = (new Date()).toString();

  return JSON.stringify({
    meta: meta,
    opts: opts,
    results: results
  }, null, 2);
}


reporter.$inject = ['baseReporterDecorator', 'config'];

module.exports = {
  'reporter:custom': ['type', reporter]
};
