module.exports.crawl = function (query, res) {
	if (typeof query === 'string' && query !== '') {
		sendUGRequest(query, 1, [], res);
	}
}

function sendUGRequest(query, page, data, res) {
	request(getSearchUrl(query, page), function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			data = data.concat(scraper.scrape($));
			if (scraper.isFinalPage($, page) === false) {
				sendUGRequest(query, page + 1, data, res);
			} else {
				res.send(data.map(formatter.formatResult));
			}
		}
	});
}

function getSearchUrl(query, page) {
	var url ='https://www.ultimate-guitar.com/search.php?search_type=title&value=';
	return url +=  query + '&page=' + page;
}