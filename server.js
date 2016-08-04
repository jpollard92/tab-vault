var port = '1337';
var approot = './app/';
// external modules
	fs		   = require('fs'),
	request    = require('request'),
	cheerio    = require('cheerio'),
	express    = require('express'),
	bodyParser = require('body-parser');
// local modules
	crawler    = require(approot + 'crawler'),
	formatter  = require(approot + 'formatter'),
	scraper = require(approot + 'scraper');
app = express(),
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(express.static(__dirname + '/pub'));
app.listen(port)
console.log('Listening on port ' + port);
// do stuff
app.post('/scrape', function (req, res) {
	crawler.crawl(req.body, res)
});