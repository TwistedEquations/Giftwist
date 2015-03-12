var parser = require('ua-parser');

/**
 * Parses the ua string and figures out with video format to play;
 * @param  {String} ua The browser UA String
 * @return {Array}     Order of prefered video formats 
 */
var parse = function(ua) {
	var parsedUA = parser.parse(ua).toString();

	if()
};

exports.parse = parse;

var chrome = ["webm", "mp4", "gif"];
var firefox = ["webm", "mp4", "gif"];
var safari = ["mp4", "gif"];
var opera = ["webm", "mp4", "gif"];
var internetExplorer9 = ["mp4","gif"];
var internetExplorer = ["gif"];