function initiate() {
	var input = document.getElementById('userinput').value;
	if (input.trim() !== '') {
		sendRequest(input, 'text/plain');
	}
	return false;
}

function sendRequest(input, contentType) {
	$.ajax({
		type: "POST",
		contentType: contentType,
		async: "true",
		url: "/scrape",
		data: input,
		timeout: 30000,
		success: function(response) {
			if (response.constructor === Array) {
				var html = convertArrayToUl(response);
				$('.output').append(html);
			}
		},
		error: function() {
		    alert('lol');
	    }
    });
}

function convertArrayToUl(arr) {
	var replaceUrl = 'https://tabs.ultimate-guitar.com/';
	var list = arr.reduce(function (result, tab) {
		var url = tab.url;
		return result + '<li>'
		+ '<a href="' + url + '">' + url.replace(replaceUrl, '') + '</li>';
	}, '');

	return '<ul>' + list + '</ul>';
}
