exports.get = function(req, res) {
	//load the config
	var url = req.url;

	if(url === "/") {
		url = "/index";
	}

	var lastChar = url.substr(url.length - 1);

	if(url.length > 1 && lastChar === '/') {
		url = url.slice(0,-1);
	}

	var path = require('path');
	var fs = require('fs');

	var filePath = path.join(__localdir , "pages" , url + ".html");
	var filePath = path.normalize(filePath);

	fs.readFile(filePath, "utf8", function(err , data) {
		if(err) {
			return res.status(404).end('not found');
		}

	res.end(data);

	});

	

	/*var rewroteUrl = map[url];
	if(!rewroteUrl) {
		//res.writeHead(404);
		res.end();
	}

	rewroteUrl = __dirname +"/../public"+rewroteUrl;
	console.log(rewroteUrl);

	var path = require('path');
	var fs = require('fs');

	fs.exists(rewroteUrl, function(exists) {
		if (exists) {
			fs.readFile(rewroteUrl, function(error, content) {
				if (error) {
					res.end();
				}
				else {
					res.end(content, 'utf-8');
				}
			});
		}
		else {
			//res.writeHead(404);
			res.end();
		}
	});*/
}