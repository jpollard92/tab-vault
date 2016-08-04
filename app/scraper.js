/* 
*	[0] => URL, 
*	[1] => [Rating, Votes]]
*/
module.exports.scrape = function ($) {	
	return $('.song.result-link').filter(function () {
		return isWanted($(this).attr('href'));
	})
	.map(function () {
		return [[$(this).attr('href'), getRating($(this).closest('tr'))]];
	})
	.toArray();
}

module.exports.isFinalPage = function ($, page) {
	return page >= $('.paging a').length || page >= 10 || !page;
}

/*
*	[0] => Rating
*	[1] => Votes
*/
function getRating(tr) {
	var span = tr.find('.rating');
	
	if (span && span.length !== 0) {
		var rating = span.find('.icon-rating-sm__active').length
			+ 0.5 * span.find('.icon-rating-sm__half').length;
		var votes = parseInt(tr.find('.ratdig').html());
		
		return [rating, votes];
	}
	return [0, 0];
}

function isWanted(url) {
	var wantedUrl = 'https://tabs.ultimate-guitar.com/';
	return typeof url === 'string' && url.substr(0, wantedUrl.length) === wantedUrl;
}