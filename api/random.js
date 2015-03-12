var get = function(req, res) {

	var mongo = require('../src/mongo');
	var utils = require('../src/utils');
	var viewDataModel = require('../src/models/ViewData');
	var ViewData = new viewDataModel.ViewData();

	mongo.getRandomGif(function(err, doc) {
		if(err) {
			console.log(err);
            res.render('error.html', {title: 500, error: "500 Server Error"});
            return;
		}

	ViewData.title = "Random"; 

	console.log(JSON.stringify(ViewData.actionBar, null, 4));

	var randomButton = {text : "Random Gif", link : "/random"};
	ViewData.actionBar.buttons.push(randomButton);
	res.render("random.html", ViewData);

		
	});

	
	
};

exports.get = get;