var fs = require('fs');
var path = require('path');

var creds = require('../../plotly_credentials.json');
var plotly = require('plotly')(creds.username, creds.apiKey);

var pathToOut = path.join(__dirname, 'data.json');

plotly.getFigure('choldgraf', '73', function(err, fig) {
  if(err) throw err;

  fs.writeFile(pathToOut, format(fig), function(err) {
    if(err) throw err;
  });
});

function format(obj) {
  return JSON.stringify(obj, null, 2);
}
