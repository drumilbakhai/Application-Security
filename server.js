var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var multer = require('multer');

var routes = require('./routes/imagesFile');

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'public/uploads')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});

var upload = multer({ storage:storage });

app.use(express.static(__dirname + '/public'));
mongoose.Promise = global.Promise;

var promise = mongoose.connect('mongodb://localhost/sampleData', {
	useMongoClient: true
})

promise.then(function(db){
	console.log('Connection Successfull');
})
.catch(function(err){
	console.log('Not able to make connection because '+err);
});

app.route('/')
	  .get(routes.connection)
	  .post(upload.single('myimage'),routes.uploadImage)

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.route('/images')
	.get(routes.getAllImages)

app.route('/redirect')
   .get(routes.redirect);

app.listen(port);
console.log('Server Started on '+port);