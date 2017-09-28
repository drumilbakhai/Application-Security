var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs');


var imageSchema = mongoose.Schema({
	user:{
		type: String,
		default: 'guest'
	},
	path:{
		type: String,
		required: true
	},
	originalname:{
		type: String,
		required: true
	},
	created:{
		type: Date,
		default: Date.now
	}
});

var SingleImage = mongoose.model('image', imageSchema);


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
		addImage(imagePath, function(err,data){
			if(err){
				res.send('Problem in uploading File');
			}
			else{
				res.send("File uploaded "+imagePath['originalname']);
			}
		})
		
	}

}

function addImage(imagePath, callback){
	SingleImage.create(imagePath, function(err,data){
		if(err){
			callback(err,null);
		}
		else{
			callback(null,data);
		}
	})
}

exports.getAllImages = function(req,res){
	SingleImage.find().sort({'created':-1}).exec(function(err,data){
		if(err){
			res.send('Some Problem');
		}
		else{
			var finalResults = [];
			data.forEach(function(record){
				try{
					// var contentData = fs.readFileSync(record.path);
					var results = {};
					results['filename'] = record.originalname;
					var finalPath = record.path.replace('public','');
					results['path'] = finalPath;
					finalResults.push(results);	

				}
				catch(err){
					results['filename'] = undefined;
					results['contentData'] = undefined
				}
				

			})
			console.log(finalResults);
			res.render("../views/display.ejs", {title: 'Image', link:finalResults});
			// res.send(finalResults);
			}
	})
}

exports.redirect = function(req,res){
	res.render('../views/index.ejs');
}
