/*
*	...com/x/{Artist}/{Song}_{Version}_{Type}.htm
*	legacy: ...com/1234567
*	[0] => URL
*	[1] => Song
*	[2] => Artist
*	[3] => Version
*	[4] => Type (tab, gp5, etc)
*/
var formatResult = function(data) {
	// console.log(data);
	var artist = data.split('/')[4];
	var song = isNaN(artist) ? data.split('/')[5] : artist;
	var type = getTabType(song);
	var version = getVersion(song);
	song = stripSongName(song, type, version);
	console.log([data, song, artist, version, type]);
	return [data, song, artist, version, type];
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
	var types = ['tab', 'guitar_pro', 'power_tab', 'crd', 'btab'];
	var type = 'legacy';
	types.forEach(function(element) {
		if (matchType(tab, element) === true) {
			type = element;
		}
	});
	// assume legacy if not found
	return type;
}

function getVersion(tab) {
	var version = tab.match(/ver[0-9]*/i);
	return version ? version[0] : 'ver1';
}

function matchType(tab, type) {
	return type === tab.substr(tab.length - type.length, type.length) 
		|| type === tab.substr(tab.length - type.length - 4, type.length);
}

module.exports.formatResult = formatResult;