/*
 * GET home page.
 */

exports.get = function(req, res) {
    
    var utils = require('../src/utils');
    var mongo = require('../src/mongo');

    var page = req.param("page");
    if(!page) {
        page = 0;
    }

    mongo.getGifs(page, 20, function(err, docs){
        if(err) {
            console.log(err);
            res.render('error.html', {title: 500, error: "500 Server Error"});
            return;
        }

        var ua = req.headers['user-agent'];
        var formats = utils.perferedFormat(ua);
        var videoArray = [];

        var supportsWebM = formats.indexOf('webm') > -1;
        var supportsMp4 = formats.indexOf('mp4') > -1;

        for (var i =0; i < docs.length; i++) {
            var row = docs[i];
            var video = {};
            video.id = row.fileName;
            video.gifSize = utils.convertSize(row.gifSize);
            video.webmSize = utils.convertSize(row.webmSize);
            video.mp4Size = utils.convertSize(row.mp4Size);

            if(supportsWebM && supportsMp4) {
                //supports webM and mp4
                if(row.webmSize <= row.mp4Size) {
                    video.videoSize = utils.convertSize(row.webmSize);
                    video.format = "webm";
                    video.size = video.webmSize;
                }
                else {
                    video.videoSize = utils.convertSize(row.mp4Size);
                    video.format = "mp4";
                    video.size = video.mp4Size;
                }
            }
            else if(supportsWebM) {
                video.videoSize = utils.convertSize(row.webmSize);
                video.format = "webm";
                video.size = video.webmSize;
            }
            else if(supportsMp4) {
                video.videoSize = utils.convertSize(row.mp4Size);
                video.format = "mp4";
                video.size = video.mp4Size;
            }
            else {
                video.gifSize = utils.convertSize(row.gifSize);
                video.format = "gif";
                video.size = video.gifSize;
            }
            
            videoArray.push(video);
        }
        res.write(JSON.stringify(videoArray));
        res.end();

    });
};

