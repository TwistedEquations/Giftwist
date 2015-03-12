/**
 * Schema for the gif model
 * @type {Schema}
 */
var GifModel = getGifModel();
var ProgressModel = getProgressModel();

/**
 * Insert a new gif doc into collection
 * @param  {String} fileName
 * @param  {Number} gifSize
 * @param  {Number} webmSize Size of the webm file
 * @param  {Number} oggSize
 * @param  {Number} mp4Size
 * @param  {Array[String]} tags
 * @param  {Boolean} nsfw
 * @param  {Function} callback optional
 * @Param  {Boolean} processed
 */
var insertGif = function(fileName, tags, nsfw, callback) {
		var gif = new GifModel();
		gif.fileName = fileName;
		gif.tags = tags.split(',');
		gif.nsfw = nsfw;
		gif.processed = false;
		gif.random = Math.random();
		gif.save(function(err) {
			if(typeof callback === 'function') {
				callback(err);
			}
		});
}

var updateGif = function(fileName, gifSize, webmSize, mp4Size, callback) {

	GifModel.update(

		{fileName: fileName},

		{$set: 
			{webmSize : webmSize,
			gifSize : gifSize,
			processed:true,
			mp4Size : mp4Size}
		}, 

		{upsert: true}, 

		function(err, progress){

			if(typeof callback === 'function') {
				callback(err);
			}
		});
}

/**
 * Updates the progress collection for a given fileName
 * @param  {String}   fileName
 * @param  {Number}   progress
 * @param  {Function} (optional)
 */
var updateProgress = function (fileName, progress, callback) {
	ProgressModel.update(

		{fileName: fileName},

		{$set: { fileName: fileName, progress: progress }}, 

		{upsert: true}, 

		function(err, progress){
			if(typeof callback === 'function') {
				callback(err);
			}
		});
}

var getProgress = function (fileName, callback) {
	var query = ProgressModel.findOne(

		{fileName : fileName}, 

		function(err, doc) {
			callback(err, doc.progress);
	});
}

var getGifs = function (page, count, callback) {
	var offset = page*count;
	GifModel.find({processed: true}).sort({date: -1}).skip(offset).limit(count).exec(callback);
}

var getGifForID = function (id, callback) {
	GifModel.findOne({fileName: id}).exec(callback);
}

var getRandomGif = function(callback) {
	var random = Math.random();
	GifModel.findOne({random: random}).sort({random : -1}).exec(callback);
}

var convertDocToView = function (supports, doc) {

    var video = {};
    var utils = require('./utils');
    video.idhash = doc.fileName;
    video.gifSize = utils.convertSize(doc.gifSize);

    if(supports.webm && supports.mp4) {
        //supports webM and mp4
        if(doc.webmSize <= doc.mp4Size) {
            video.videoSize = utils.convertSize(doc.webmSize);
            video.format = "webm";
        }
        else {
            video.videoSize = utils.convertSize(doc.mp4Size);
            video.format = "mp4";
        }
        
    }
    else if(supports.webm) {
        video.videoSize = utils.convertSize(doc.webmSize);
        video.format = "webm";
    }
    else if(supports.mp4) {
        video.videoSize = utils.convertSize(doc.mp4Size);
        video.format = "mp4";
    }
    else {
        video.gifSize = utils.convertSize(doc.gifSize);
        video.format = "gif";
    }
    
    video.idhash = doc.fileName;
    return video;
}

exports.getGifForID = getGifForID;
exports.getRandomGif = getRandomGif;
exports.convertDocToView = convertDocToView;
exports.getGifs = getGifs;
exports.getProgress = getProgress;
exports.updateProgress = updateProgress;
exports.insertGif = insertGif;
exports.updateGif = updateGif;

function getDBConnection() {
	var mongoose = require('mongoose');
	return mongoose.createConnection('mongodb://localhost/images');
}

function getGifModel() {
	var mongoose = require('mongoose');
	var gifSchema = mongoose.Schema({
		fileName: { type: String, index: {unique: true, dropDups: true} },
		gifSize : Number, 
		webmSize : Number, 
		mp4Size : Number,
		date : {type: Date , default : Date.now},
		tags:[String],
		nsfw:Boolean,
		random : {type: Number, index: true},
		processed : {type: Boolean, default : false}
	});
	return mongoose.model('Gif', gifSchema);
}

function getProgressModel() {
	var mongoose = require('mongoose');
	var progressSchema = mongoose.Schema({
		progress : Number,
		fileName: { type: String, index: {unique: true, dropDups: true} },
	});
	return mongoose.model('Progress', progressSchema);
}