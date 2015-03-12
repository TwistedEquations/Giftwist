var mkdirp = require('mkdirp');
var parser = require('ua-parser');

/**
 * Converts raw numbers of bytes to readable format eg "1.2MB"
 * @param  {Number} size 
 * @return {String}      Human readable format of size;
 */
var convertToReadableSize = function(size) {
    size = size/1024;
    size = Math.round(size);
    
    if(size > 1024) {
        size = size/1024;
        size = Math.round(size * 100) / 100;
        return size+"Mb";
    }
    return size+"Kb";
}

/**
 * Check if the dir exists and creates it if it does not 
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
var checkDir = function (dir) {
    
    mkdirp.sync(dir);
}

/**
 * Parses the ua string and figures out with video format to play;
 * @param  {String} ua The browser UA String
 * @return {Array}     Order of prefered video formats 
 */
var perferedFormat = function(ua) {
    var parsedUA = parser.parse(ua);

    var family =parsedUA.ua.family;
    if(family.indexOf("Chrome") > -1) {
        return ["webm", "mp4", "gif"];
    }
    else if (family.indexOf("Firefox") > -1) {
        return ["webm", "gif"];
    }
    else if (family.indexOf("Safari") > -1) {
        return ["mp4", "gif"];
    }
    else if (family.indexOf("IE")>-1) {
        if(parsedUA.ua.major >= 9) {
            return ["mp4","gif"];
        }
        else {
            return ["gif"];
        }
    }
    else if (ua.indexOf('Trident/') > -1) {
        return ["mp4","gif"];
    }
    else if (family.indexOf("Opera") > -1) {
        return ["webm", "mp4", "gif"];
    }
    else {
        return ['gif'];
    }
};

var getMime = function (ext) {
    switch (ext) {
        case "gif":
                return "image/gif";

        case "webm":
                return "video/webm";

        case "mp4":
                return "video/mp4";

        case "ogg":
                return "video/ogg";

        default:
                return null;
    }
    
}

var supports = function(uaString) {
    var support = {};
    var formats = perferedFormat(uaString);
    support.webm = formats.indexOf('webm') > -1;
    support.mp4 = formats.indexOf('mp4') > -1;
    return support;
};

exports.urlRewrite = function(req, res, next) {

    var url = req.url;
    if(!url || url === "/") {
        next();
        return;
    }

    //if the url is an api url then return null;
    if(url.indexOf("api") != -1  || url.indexOf(".html") != -1) {
        req.url = url;
        next();
        return;
    }


    if(url.slice(-2,-1) === "/") {
       url = url.slice(0,-1);
       next();
       return;     
    }
    
    url += ".html";
    req.url = url;

    console.log(req.url);
    next();
}

exports.getMime = getMime;
exports.support = supports;
exports.supports = supports;
exports.convertSize = convertToReadableSize;
exports.checkDir = checkDir;
exports.perferedFormat = perferedFormat;