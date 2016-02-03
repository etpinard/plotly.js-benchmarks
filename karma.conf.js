var path = require('path');

var plotlyCredentials = require('./plotly_credentials');


module.exports = function(config) {
    config.set({
        basePath: '.',

        // Other Karma config here...
        frameworks: ['benchmark', 'browserify'],

        files: [
            'https://cdn.plot.ly/plotly-latest.min.js',  // or require('plotly.js')
            'suites/*.js'
        ],

        preprocessors: {
            'suites/*.js': ['browserify']
        },

        reporters: ['plotly'],
        plotlyReporter: {
            pathToJson: path.join(__dirname, 'results', 'test.json'),
            formatJson: function(results) {
                results.meta.date = (new Date()).toTimeString();
                results.meta.version = 'v1.5.1';
                return results;
            },
            username: plotlyCredentials.username,
            apiKey: plotlyCredentials.apiKey,
            filename: 'plotly-karma-reporter',
            fileopt: 'overwrite'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
