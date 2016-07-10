var scrape = function(query, res) {
	var url = 'https://www.ultimate-guitar.com/search.php?search_type=title&value=' + query["song"];		
	request(url, function(error, response, body) {
		if (!error) {
			res.send(getSongUrls(cheerio.load(body)));
		}
	});
}

function getSongUrls($) {
	var data = [];
	$('.song').each(function() {
		var href = $(this).attr('href');
		if (isWanted(href)) {
			data.push(href);
		}
	});
	return data;
}

function isWanted(url) {
	var unwantedUrls = ['', 'whatever'];
	return typeof url == 'string' && !inArray(url, unwantedUrls);
}

function inArray(val, arr) {
	arr.forEach(function(element) {
		if (element == val){ return true; }
	});
	return false;
}

module.exports.scrape = scrape;