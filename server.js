var port = '1337',
	express    = require('express'),
	bodyParser = require('body-parser'),
	crawler    = require('./app/crawler'),
	app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(express.static(__dirname + '/pub'));
app.listen(port);

console.log('Listening on port ' + port);

app.post('/scrape', function (req, res) {
	crawler.crawl(req.body, res);
});
