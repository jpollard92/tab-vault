var scrape = function(query, res) {
	sendUGRequest(query, getSearchType(query), 1, [], res);
}

function sendUGRequest(query, searchType, page, data, res) {
	request(getSearchUrl(query, searchType, page), function(error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			data = data.concat(getSongUrls($));
			if (isFinalPage(page, $('.paging')) === false) {
				page++;
				sendUGRequest(query, searchType, page, data, res);
			} else {
				res.send(data.map(formatter.formatResult));
			}
		}
	});
}

function getSearchUrl(query, searchType, page) {
	var url ='https://www.ultimate-guitar.com/search.php?search_type=title&value=';
	url += searchType  == 'hybrid' ? query['song'] + ' ' + query['band']
		: searchType == 'song' ? query['song']
		: searchType == 'band' ? query['band']
		: '';
	
	return url += '&page=' + page;
}

function isFinalPage(activePage, paginationDiv) {
	var pageCount = paginationDiv.find('a').length;
	return activePage && pageCount && activePage < pageCount ? false : true;
}

function getSongUrls($) {
	return getUrls($, '.song.result-link');
}

function getBandUrls($) {
	return getUrls($, '.song.search-art');
}

function getUrls($, urlType) {
	var urls = [];
	$(urlType).each(function() {
		var href = $(this).attr('href');
		if (isWanted(href)) {
			urls.push(href);
		}
	});
	return urls;
}

function isWanted(url) {
	var unwantedUrls = ['', 'whatever'];
	return typeof url == 'string' && !inArray(url, unwantedUrls);
}

function getSearchType(query) {
	if (query['song'].trim() !== '' ) {
		if (query['band'].trim() !== '' ) {
			return 'hybrid';	
		}	
		return 'song';
	} else if (query['band'].trim() !== '') {
		return 'band';
	}
	return '';
}

function inArray(val, arr) {
	arr.forEach(function(element) { 
		if (element == val) { return true; } 
	});
	return false;
}

module.exports.scrape = scrape;