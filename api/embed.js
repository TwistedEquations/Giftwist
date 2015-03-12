exports.get = function(req, res) {
	var mongo = require('../src/mongo');

	var id =  req.params.id;
	console.log(id);

	

	mongo.getGifForID(id, function(err, doc) {

		if(err) {
			res.render("embedError.html", {});
			return;
		}

		var uaString = req.headers['user-agent'];
		var utils = require('../src/utils');
		var support = utils.support(uaString);

		var video = mongo.convertDocToView(support, doc);
		video.mime = utils.getMime(video.format);

		res.render("embed.html", {video : video});

	});
}