var port = '1337';
var approot = './app/';
// external modules
var http	   = require('http');
	fs		   = require('fs'),
	request    = require('request'),
	cheerio    = require('cheerio'),
	express    = require('express'),
	app		   = express(),
	bodyParser = require('body-parser');
// local modules
	crawler    = require(approot + 'crawler');
	formatter  = require(approot + 'formatter');
// configuration
app.use(bodyParser.json({ strict: false })) // parse application/json
app.use(express.static(__dirname + '/pub'));
app.listen(port)
console.log('Listening on port ' + port);
// do stuff
app.post('/scrape', function(req, res) {
	crawler.scrape(req.body, res)
});

