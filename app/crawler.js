var request    = require('request'),
	cheerio    = require('cheerio'),
	formatter  = require('./crawler/formatter'),
	scraper    = require('./crawler/scraper');

module.exports.crawl = function (query, res) {
	if (typeof query === 'string' && query !== '') {
		sendUGRequest(query, 1, [], res);
	}
}

function sendUGRequest(query, page, data, res) {
	request(getSearchUrl(query, page), function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			if (scraper.isFinalPage($, page) === false) {
				sendUGRequest(
					query,
					page + 1,
					data.concat(scraper.scrape($)),
					res
				);
			} else {
				res.send(
					data.concat(scraper.scrape($)).map(formatter.formatResult)
				);
			}
		}
	});
}

function getSearchUrl(query, page) {
	var url ='https://www.ultimate-guitar.com/search.php?search_type=title&value=';
	return url +=  query + '&page=' + page;
}
