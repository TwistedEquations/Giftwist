/**
 * Starts the FFMpeg to convert to VP8/webm.
 *
 * @param {gifPath} fullpath to the gif file to be converted
 * @param {webmDir} directory to output webm to
 * @param {webmName} name of webm file
 * @param {callback} callback  @param {progress}
 * 							   @param {error}
 *							   @param {finished}
 */
var convertWebm = function convertWebm(gifPath, webmDir, webmName, callback) {

	var FFmpeg = require('fluent-ffmpeg');
    
    var webmFileOutput = webmDir +"/"+ webmName+".webm";

    var bitrate = 650;
    try {
       var imageSize = require('image-size');
       var dimensions = imageSize(gifPath);
       var imageRes = dimensions.width*dimensions.height;
       var bitrate = (imageRes/250); 
    }
    catch (err) {
        
    }
    
    console.log("Converting gif to webm - "+webmName +" , with bitrate = "+bitrate);

    var command = new FFmpeg({ source: gifPath});
    command.withNoAudio();
    command.withVideoCodec('libvpx');
    command.toFormat('webm');
    command.withVideoBitrate(bitrate);
    command.addOption('-crf', '38');

    command.on('start', function(commandLine) {
    	console.log('\nWebM conversionStarted');
    })

    .on('codecData', function(data) {
        console.log('\nInput is ' + data.audio + ' audio with ' + data.video + ' video');
    })

    .on('progress', function(progress) {
    	console.log('\nWebm Processing: ' + progress.percent + '% done');
    	callback(progress.percent, null, false);
    })

    .on('error', function(err) {
        console.log('\nWebm Processing: Failed ' + err.message);
        callback(null, err, true);
    })

    .on('end', function() {
    	console.log('\nWebm Processing finished successfully');
        callback(null, null, true);
        
    });

    command.saveToFile(webmFileOutput);
};

/**
 * Starts the FFMpeg to convert to H.246/MP4.
 *
 * @param {gifPath} fullpath to the gif file to be converted
 * @param {mp4Dir} directory to output mp4 to
 * @param {mp4Name} name of mp4 file
 * @param {callback} callback  @param {progress}
 * 							   @param {error}
 *							   @param {finished}
 */
var convertMp4 = function convertMp4(gifPath, mp4Dir, mp4Name, callback) {

	var FFmpeg = require('fluent-ffmpeg');
    
    var mp4FileOutput = mp4Dir +"/"+ mp4Name+".mp4";
    
    console.log("Converting gif to mp4 - "+mp4Name );
    var command = new FFmpeg({ source: gifPath});
    command.withNoAudio();
    command.withVideoCodec('libx264');
    command.toFormat('mp4');
    command.addOption('-crf','25');
    command.addOption('-pix_fmt','yuv420p');
    command.addOption('-profile:v','main');
    command.addOption('-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2');

	command.on('start', function(commandLine) {
    	console.log('\nMp4 conversionStarted');
    })

    .on('codecData', function(data) {
        console.log('\nInput is ' + data.audio + ' audio with ' + data.video + ' video');
    })

    .on('progress', function(progress) {
    	console.log('\nMp4 Processing: ' + progress.percent + '% done');
    	callback(progress.percent, null, false);
    })

    .on('error', function(err) {
        console.log('\nMp4 Processing: Failed ' + err.message);
        callback(null, err, true);
    })

    .on('end', function() {
    	console.log('\nMp4 Processing finished successfully');
        callback(null, null, true);
        
    });

    command.saveToFile(mp4FileOutput);
};

/**
 * Starts the FFMpeg to convert to Theoro/OGG.
 *
 * @param {gifPath} fullpath to the gif file to be converted
 * @param {oggDir} directory to output mp4 to
 * @param {oggName} name of mp4 file
 * @param {callback} callback  @param {progress}
 * 							   @param {error}
 *							   @param {finished}
 */
var convertOgg = function convertOgg(gifPath, oggDir, oggName, callback) {

	var FFmpeg = require('fluent-ffmpeg');
    
    var oggFileOutput = oggDir +"/"+ oggName+".ogg";
    
    console.log("Converting gif to ogg - "+oggName );
    var command = new FFmpeg({ source: gifPath});
    command.withNoAudio();
    command.withVideoCodec('libtheora');
    command.toFormat('ogg');
    command.addOption('-qscale:v', '7');

	command.on('start', function(commandLine) {
    	console.log('\nOgg conversionStarted');
    })

    .on('codecData', function(data) {
        console.log('\nOgg Input is ' + data.audio + ' audio with ' + data.video + ' video');
    })

    .on('progress', function(progress) {
    	console.log('\nOgg Processing: ' + progress.percent + '% done');
    	callback(progress.percent, null, false);
    })

    .on('error', function(err) {
        console.log('\nOgg Processing: Failed ' + err.message);
        callback(null, err, true);
    })

    .on('end', function() {
    	console.log('\nOgg Processing finished successfully');
        callback(null, null, true);
        
    });

    command.saveToFile(oggFileOutput);
};

/**
 * Starts the FFMpeg to get the thumbnail
 *
 * @param {videoPath} fullpath to the video to gte the thumbnail from
 * @param {oggDir} directory to output thumbail to
 * @param {oggName} name of thumbail file
 * @param {callback} callback  @param {progress}
 *                             @param {error}
 *                             @param {finished}
 */
var getThumbnail = function getThumbnail(videoPath, thumbDir, rawname, callback) {
    
    console.log("Capping screenshot ");
    var FFmpeg = require('fluent-ffmpeg');
    var command = new FFmpeg({ source: videoPath });
    command.withSize('100%');

    command.on('error', function(err, stdout, stderr) {
        callback(null, err, true);
        
    });
    command.on('end', function(filenames) {     
        callback(null, null, true);
    });
    command.keepPixelAspect(true);
    command.takeScreenshots({
            count: 1,
            timemarks: [ '0.0' ],
            filename: rawname
        }, thumbDir); 
}

/**
 * Starts the gif conversion sends back progress trought callback
 *
 * @param {gifpath} path to the gif to be converted
 * @param {dataDir} directory to put files
 * @param {fileName} what to call the converted files
 * @param {callback} function callback @param {error} 
 *                                     @param {finished} 
 */
 exports.startConversion =  function(gifPath, dataDir, fileName, callback) {
    var webMDir  = dataDir +"/webm"
    var mp4Dir  = dataDir +"/mp4"
    var thumbDir  = dataDir +"/thumbnails"

    var utils = require('../src/utils');
    var mongo = require('./mongo');

    utils.checkDir(webMDir);
    utils.checkDir(mp4Dir);
    utils.checkDir(thumbDir);

    var async = require('async');

    var vidForThumbnail = webMDir+"/"+fileName+".webm";

    mongo.updateProgress(fileName, 0);

    async.series({
            one : function (callback) {
                convertWebm(gifPath, webMDir, fileName, function (progress, error, finished) {
                    //Send heart beat signal to client 
                    console.log("\nConvesrion in progress webm async");

                    if(error) {
                        console.log("\nConvesrion to webM failed");
                    }

                    if(finished) {
                        callback(error);
                        mongo.updateProgress(fileName, 33);
                    }
                }); 
            },
            two : function(callback) {
                convertMp4(gifPath, mp4Dir, fileName, function (progress, error, finished) {
                    //Send heart beat signal to client 
                    console.log("\nConvesrion in progress MP4 async");

                    if(error) {
                        console.log("\nConvesrion to mp4 failed");
                    }

                    if(finished) {
                        callback(error);
                        mongo.updateProgress(fileName, 66);

                    }
                }); 
            }
        },
        function (err) {
            console.log("\nvidForThumbnail + "+vidForThumbnail);
            getThumbnail(vidForThumbnail, thumbDir, fileName, function (progress, error, finished) {
                    //Send heart beat signal to client 
                    console.log("\nThumbnail async");

                    if(error) {
                        console.log("\nThumnail Failed + "+JSON.stringify(error, null, 4));
                    }

                    if(finished) {
                        callback(err, true);
                        mongo.updateProgress(fileName, 100);  
                    }
            });
        }
    );
};