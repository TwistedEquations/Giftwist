function addToDataBase(rawName) {
    var mongo = require('../src/mongo.js')
    
    var gifName = rawName+".gif";
    var webmName = rawName+".webm";
    var oggName = rawName+".ogg";
    var mp4Name = rawName+".mp4";
    
    var fs  = require('fs');
    var webmSize = fs.lstatSync(__datadir+"/webm/"+webmName).size;
    var gifSize = fs.lstatSync(__datadir+"/gif/"+gifName).size;
    var mp4Size = fs.lstatSync(__datadir+"/mp4/"+mp4Name).size;

    mongo.updateGif(rawName,gifSize,webmSize, mp4Size, function (err) {
        console.log("mongo gif inserted");
    });
}


function moveFile(req, res){
    var fs = require("fs");
    var md5 = require("crypto").createHash('md5');
    var consts = require('./consts.js');
    var date = new Date().getTime();
    
    var tempPath = req.files.image.path;
    
    //Create file name from hash
    var hashString = req.files.image.originalFilename+date+req.connection.remoteAddress;
    md5.update(hashString);
    var rawName = md5.digest('hex');
    
    var ext = consts.getfiletype(req.files.image.type);
    if(!ext) {
        res.render('uploadComplete.html', { msg:"Error = Wrong file type"});
    }
    var outputFile = rawName+consts.getfiletype(req.files.image.type);
    
    var outputFileDir = __localdir+'/public/data/gif/';
    
    var mkdirp = require('mkdirp');
    mkdirp.sync(outputFileDir);
    
    var outputFilePath = outputFileDir+outputFile;
    var inStream = fs.createReadStream(tempPath);    
    var outStream = fs.createWriteStream(outputFilePath);

    inStream.pipe(outStream);
    inStream.on('end', function() { 
        console.log("File read 200 ok");
        res.json({ msg:"All good ", id : rawName});
        
        var gifData = {
            path : outputFilePath,
            name : outputFile,
            dir : outputFileDir,
            rawName : rawName
        };

        var nsfw = false;
        if(req.body.nsfw === "on"){
            nsfw = true;
        }

        var mongo = require('../src/mongo');
        mongo.insertGif(rawName, req.body.tags, nsfw, function(err) {
            if(!err){
                    var encoder = require('../src/encoder');
                    encoder.startConversion(outputFilePath, __datadir, rawName, function (err, finished) {
                        console.log("\n Conversion finished - Error = " +err + "- finished = "+finished);
                        addToDataBase(rawName);
                    });
            }
        });

        var encoder = require('../src/encoder');
        encoder.startConversion(outputFilePath, __datadir, rawName, function (err, finished) {
            console.log("\n Conversion finished - Error = " +err + "- finished = "+finished);
            addToDataBase(rawName);
        });  
    });
    
    inStream.on('error', function(err) { 
        console.log("File read error");
        res.render('uploadComplete.html', { msg:"Error = "+JSON.stringify(err, undefined, 2)});
    });
};

function convertVideo(gifData, res) {  
    encodeVideos(gifData, res);  
};

exports.complete = function(req, res){
    res.render("uploadComplete.html");
};

exports.upload = function(req, res) {

    var viewData = require('../src/models/ViewData');
    var ViewData = new viewData.ViewData;
    console.log(ViewData);

    res.render('upload.html',ViewData);
};

exports.post = function(req, res) {

    //needs {
    //gif file, tags(csv string), nsfw (boolean);
    //}
    console.log(JSON.stringify(req.body, null, 4));
    console.log(JSON.stringify(req.files, null, 4));
    moveFile(req, res);
};

