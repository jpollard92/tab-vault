function initiate () {
	var song = document.getElementById('songinput').value;
	var band = document.getElementById('bandinput').value;
	
	if (song != '' || band !== '') {
		sendRequest(getUserInput(song, band), 'application/json; charset=UTF-8');
	}
	return false;
}

function getUserInput(song, band) {
	return JSON.stringify({"song": song, "band": band});
}

function sendRequest(input, contentType) {	
	$.ajax({
		type: "POST",
		contentType: contentType,
		async: "true",
		url: "/scrape",
		data: input,
		timeout: 3000,
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
		if(url.substring(0, replaceUrl.length) == replaceUrl) {
			html += '<li><a href="' + url + '">' 
				+ url.replace(replaceUrl, '') + '</li>';
		}
	});
	return html + '</ul>';
}