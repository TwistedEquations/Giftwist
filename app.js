
/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./api/user');
var upload = require('./api/upload');
var view = require('./api/view');
var embed = require('./api/embed');
var apiIndex = require('./api/api_index');
var utils = require('./src/utils');
var index = require('./routes/index');
var http = require('http');
var path = require('path');

var app = express();


__localdir = __dirname;
__datadir = __dirname+"/public/data";

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({secret: 'secret', key: 'express.sid'}));
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.methodOverride());
app.use(express.multipart());
app.use(express.urlencoded());

app.use(app.router);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/components', express.static(path.join(__dirname, 'components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*app.get('/view/:type/:id', view.getVideo);
app.get('/view/:id', view.getFormat);
app.get('/users', user.list);
app.post('/upload/file', upload.file);
app.get('/upload/complete', upload.complete);
app.get('/upload', upload.upload);
app.get('/random', random.get);
app.get('/embed/:id', embed.get)*/

app.get("/api/gifs/:page",apiIndex.get);
app.get("/api/gifs",apiIndex.get);
app.get("/api/upload",upload.post);

app.get("/",index.get)
app.get("/upload",index.get)

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//Db connection
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/images').connection;
db.once('open', function() {
	console.log("mongo connected");
});

db.on("error", function() {
	console.log("Failed to connect to mongoDB");
});

var io = require('socket.io').listen(server);
var socketManager = require('./src/socketmanager');

io.sockets.on('connection', socketManager.onConnect);

