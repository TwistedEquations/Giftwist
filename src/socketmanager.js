
var socket;

var onconnect = function (connectedSocket) {
	socket = connectedSocket
	socket.on("get_progress", get_progress);
};

var get_progress = function(data) {

		if(!data.id) {
			return;
		}
		var mongo = require('./mongo');
		mongo.getProgress(data.id, function (err, progress) {
			var data = {progress : progress };
			if(socket){
				socket.emit("receive_progress",data);
			}
		});
};

exports.onConnect = onconnect; 