// Require the nedb module
var Datastore = require('nedb'),
	fs = require('fs');

//Initialize two nedb databases.
var photos = new Datastore({ filename: __dirname + '/data/photos', autoload: true}),
    users = new Datastore({ filename: __dirname + '/data/users', autoload: true });

//Create id for photoname and user ip
photos.ensureIndex({fieldName: 'name', unique: true});
users.ensureIndex({fieldName: 'ip', unique: true});

//Load all images from the public/photos in the db
var photos_on_disk = fs.readdirSync(__dirname + '/public/photos');

//Add photos to db
//Subsequent writes wil fail resulting only in one record per image
photos_on_disk.forEach(function(photo){
	photos.insert({
		name: photo,
		likes: 0,
		dislikes: 0
	});
});

//Photos and user data sets avaible
module.exports = {
	photos: photos,
	users: users
};