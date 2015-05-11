//This file defines routes used
//Requires the database module

var db = require('./database'),

	temperatures = db.temperatures;
//	photos = db.photos,
//	users = db.users;

module.exports = function(app){
	//Homepage
	app.get('/', function(req, res){

		/*
		//Find photos
        photos.find({}, function(err, all_photos){
        	//Current user
        	users.find({ip: req.ip}, function(err, u){
        		var voted_on = [];
        		if(u.length == 1){
        			voted_on = u[0].votes;
        		}

        		//Photos user has not voted on

        		var not_voted_on = all_photos.filter(function(photo){
        			return voted_on.indexOf(photo._id) == -1;
        		});

        		var image_to_show = null;

        		if(not_voted_on.length > 0){
        			//Random image from the array
                    image_to_show = not_voted_on[Math.floor(Math.random()*not_voted_on.length)];
                }
                res.render('home', {photo: image_to_show });
        	});
        });
*/
	});

	app.get('/standings', function(req, res){

		/*
		photos.find({}, function(err, all_photos){
			//Sort img
			all_photos.sort(function(p1, p2){
				return (p2.likes - p2.dislikes) - (p1.likes - p1.dislikes);
			});
			//Render the standings tmep and pass the imgs
			res.render('standings', {standings: all_photos});
		});
		*/
	});

	//This is executed before the next two post req
	app.post('*', function(req,res,next){
		/*
		//Register the user in db by ip
		users.insert({
			ip: req.ip,
			votes: []
		}, function(){
			//Conitnue with the other routes
			next();
		});
*/
	});

};