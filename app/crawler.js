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
				res.send(data.map(formatResult));
			}
		}
	});
}


/*
*	...com/x/{Artist}/{Song}_{Version}_{Type}.htm
*	legacy: ...com/1234567
*	[0] => URL
*	[1] => Song
*	[2] => Artist
*	[3] => Version
*	[4] => Type (tab, gp5, etc)
*/
function formatResult(data) {
	// console.log(data);
	var artist = data.split('/')[4];
	var song = isNaN(artist) ? data.split('/')[5] : artist;
	var type = getTabType(song);
	var version = getVersion(song);
	
	if (type !== 'legacy') {
		song = song.substr(0, song.length - type.length - 5);	// strip _{Type}.htm
		if (version !== 'ver1') {
			song = song.substr(0, song.length - version.length - 1);	// strip _{Version}
		}
	}
	
	console.log([data, song, artist, version, type]);
	return [data, song, artist, version, type];
}

function getVersion(tab) {
	var version = tab.match(/ver[0-9]*/i);
	return version ? version[0] : 'ver1';
}

function getTabType(tab) {
	var types = ['tab', 'guitar_pro', 'power_tab', 'crd', 'btab'];
	var type = 'legacy';
	types.forEach(function(element) {
		if (element === tab.substr(tab.length - element.length, element.length) // might have .htm on the end
			|| element === tab.substr(tab.length - element.length - 4, element.length)) {
			type = element;
		}
	});
	// assume legacy if not found
	return type;
}

// basically a shitty ucwords if your string has _ instead of spaces
function formatString(str) {
	//console.log(str);
	if (typeof str === 'str') {
		return str.split('_').map(function(str) {
			return str.substr(0,1).toUpperCase() + str.substr(1);
		}).join(' ');
	}
	return str;
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