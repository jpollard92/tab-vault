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
	var html = '<ul>';
	arr.forEach(function(url) {
		url = url[0];//temporary
		if(url.substring(0, replaceUrl.length) == replaceUrl) {
			html += '<li><a href="' + url + '">' 
				+ url.replace(replaceUrl, '') + '</li>';
		}
	});
	return html + '</ul>';
}