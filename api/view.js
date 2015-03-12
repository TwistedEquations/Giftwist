function getFormat(req, res) {

    var idhash = req.params.id;
    var mongo = require('../src/mongo');
    var utils = require('../src/utils');

    mongo.getGifForID(idhash, function(err, doc) {

        if(err) {
            console.log(err);
            res.render('error.html', {title: 500, error: "500 Server Error"});
            return;
        }
        if(!doc) {
            res.render('error.html', {title: 404, error: "404 Gif not found"});
            return;
        }
        var viewData = require('../src/models/ViewData');
        var ViewData = new viewData.ViewData();
        var ua = req.headers['user-agent'];
        var supports = utils.supports(ua);
        ViewData.video = mongo.convertDocToView(supports, doc);

        res.render("format.html", ViewData);
    });
}

function getVideo(req, res) {

	var id =  req.params.id;	
    var type =  req.params.type;
    var utils = require('../src/utils');
    
    var video = {};
    var viewData = require('../src/models/ViewData');
    var ViewData = new viewData.ViewData();
    ViewData.video = video;

    var mime = utils.getMime(type);
    if(mime) {
        video.mime = mime;
        video.folder = type;
        video.id = id;
        video.ext = type;
    }

	res.render('view.html', ViewData);
}

exports.getVideo = getVideo;
exports.getFormat = getFormat;