var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;


var routes = require('./routes/imagesFile');
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
	  .get(routes.connection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port);
console.log('Server Started on '+port);