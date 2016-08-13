/*
*	...com/x/{Artist}/{Song}_{Version}_{Type}.htm
*	legacy: ...com/tab/1234567
*/
module.exports.formatResult = function (result) {
	var splitUrl = result[0].split('/');
	var artist = splitUrl[4];
	var song = isNaN(artist) ? splitUrl[5] : artist;
	var type = getTabType(song);
	var version = getVersion(song);

	var response =  {
		url: result[0],
		song: stripSongName(song, type, version),
		artist: artist,
		version: version,
		type: type,
		rating: result[1][0],
		votes: result[1][0]
	}

	return response;
}

function stripSongName(song, type, version) {
	if (type !== 'legacy') {
		song = song.substr(0, song.length - type.length - 5);	// strip _{Type}.htm
		if (version !== 'ver1') {
			song = song.substr(0, song.length - version.length - 1);	// strip _{Version}
		}
	}

	return song;
}

function getTabType(tab) {
	var type = ['power_tab', 'btab', 'tab', 'guitar_pro', 'crd'].filter(
		function (element) { return matchType(tab, element); }
	);

	return type.length > 0 ? type[0] : 'legacy';
}

function getVersion(tab) {
	var version = tab.match(/ver[0-9]*/i);
	return version ? version[0] : 'ver1';
}

function matchType(tab, type) {
	return type === tab.substr(tab.length - type.length, type.length)
		|| type === tab.substr(tab.length - type.length - 4, type.length);
}
