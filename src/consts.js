
exports.constants = {
    dbname : "images",
    dbhost : "localhost",
    imagesTable : {
        name : 'images',
        colId : "id",
        colGif : "gif",
        colDate : "date",
        colWebm : "webm",
        colMp4 : "mp4",
        colOgg : "ogg",
        colFile : "idhash",
        colGifSize :"gifsize",
        colMp4Size :"mp4size",
        colOggSize :"oggsize",
        colWebmSize :"webmsize"
    },
    dbpass : "o8036645t",  
    dbuser : "website"
};

exports.mySqlConnectionObject ={
        host     : exports.constants.dbhost,
        user     : exports.constants.dbuser,
        password : exports.constants.dbpass,
        database : exports.constants.dbname
};

exports.getfiletype = function(mime) {
    
    switch(mime) {

        case "image/gif":
            return ".gif";

        case "video/mp4":
            return ".mp4";

        case "video/webm":
            return ".webm";

        case "image/ogg":
            return ".ogg";
    }
}