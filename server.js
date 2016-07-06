var port = '1337';
// dependencies
var http	   = require('http');
	fs		   = require('fs'),
	request    = require('request'),
	cheerio    = require('cheerio'),
	express    = require('express'),
	app		   = express(),
	bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ strict: false })) // parse application/json
app.use(express.static(__dirname));
app.listen(port)
console.log('Listening on port ' + port);
// do stuff
app.post('/scrape', function(req, res) {
	var query = req.body;
	var url = 'https://www.ultimate-guitar.com/search.php?search_type=title&value=' + query["song"];
	//console.log(url);
	request(url, function(error, response, body){
		if (!error) {
			var $ = cheerio.load(body);
			var data = [];
			$('.song').each(function() {
				var href = $(this).attr('href');
				data.push(href);
				console.log(href);
			});
		} else {
			console.log('oops');
		}
		console.log(data);
		res.send(data);
	});
});

