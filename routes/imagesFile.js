var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');

// var storage = multer.diskStorage({
// 	destination:'/uploads/',
// 	filename: function(req,file,callback){
// 		callback(null,filename.originalname)
// 	}
// })

var imageSchema = mongoose.Schema({
	path:{
		type: String,
		required: true
	},
	originalname:{
		type: String,
		required: true
	}
});

var SingleImage = mongoose.model('image', imageSchema);

var upload = multer({ dest: 'uploads/' });

exports.connection = function(req,res){
	// res.send('Application is up and running');
	res.render('../views/index.ejs');
};

exports.uploadImage = function(req,res){
	console.log('file name is '+req.file);
	if(!req.file){
		res.send('Please select a file');
	}
	else{
		var imagePath = {}
		imagePath['path'] = req.file.path;
		imagePath['originalname'] = req.file.originalname;
		res.send("File uploaded "+imagePath['originalname']);
	}

}