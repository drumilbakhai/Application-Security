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
	},
	caption:{
		type: String,
		default: 'No Caption Inserted'
	}
});

var SingleImage = mongoose.model('image', imageSchema);


exports.connection = function(req,res){
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
		imagePath['caption'] = req.body.caption;
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
					results['caption'] = record.caption;
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
			
			}
	})
}

exports.getImagesByUser = function(req,res){
	SingleImage.find({'user':req.params.user}).sort({'created':-1}).exec(function(err,data){
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
			
			}
	})
}

exports.redirect = function(req,res){
	res.render('../views/index.ejs');
}

exports.displayPagination= function(req, res){

    //set default variables
    var totalStudents = 70,
        pageSize = 8,
        pageCount = totalStudents/8,
        currentPage = 1,
        students = [],
        studentsArrays = [], 
        studentsList = [];

    //genreate list of students
    for (var i = 1; i < totalStudents; i++) {
        students.push({name: 'Student Number ' + i});
    }

    //split list into groups
    while (students.length > 0) {
        studentsArrays.push(students.splice(0, pageSize));
    }

    //set current page if specifed as get variable (eg: /?page=2)
    if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    }

    //show list of students from group
    studentsList = studentsArrays[+currentPage - 1];

    //render index.ejs view file
    res.render('../views/pagination.ejs', {
        students: studentsList,
        pageSize: pageSize,
        totalStudents: totalStudents,
        pageCount: pageCount,
        currentPage: currentPage
    });
}