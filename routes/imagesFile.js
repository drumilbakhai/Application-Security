var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs');

mongoose.set('debug', true);
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
				// TODO: Add a view file to display success message
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
	customPagination(req,res);
}

exports.getImagesByUser = function(req,res){
	var user = req.params.user;
	customPagination(req,res,user);
	
}

exports.redirect = function(req,res){
	res.render('../views/index.ejs');
}

exports.displayPagination= function(req, res){
	customPagination(req,res);
}

function customPagination(req,res,user){
	var query = {};
	if(!user){
		query={};
	}
	else{
		query['user'] = user
	}
	
	var pageSize = 10,
	    currentPage = 1,
		images = [],
		imagesArrays = [],
		imagesList = [];
    //set default variables

   	SingleImage.count({}, function(err,count){
   		if(err){
   			console.log('err')
   		}
   		else{
   			var totalImages = count;
   			var pageCount = Math.ceil(totalImages / pageSize);
   			console.log('Total Images are '+totalImages)
   			console.log("Query is "+query);
   			SingleImage.find(query, ["-_id","path","user","caption"]).sort({'created':-1}).exec(function(err,data){
   				if(err){
   					console.log('Problem in retrieving Images '+err)
   				}
   				else{
   					// console.log(data);
   					data.forEach(function(record){
   						var results = {};
   						results['user'] = record.user;
						results['caption'] = record.caption;
						var finalPath = record.path.replace('public','');
						results['path'] = finalPath;
						// finalResults.push(results);	
   						images.push(results);

   					})
   					// res.send(images);
   					while(images.length > 0){
   						imagesArrays.push(images.splice(0,pageSize))
   					}
   					console.log('Images Aray splicer '+imagesArrays);
   					if (typeof req.query.page !== 'undefined') {
				        currentPage = +req.query.page;
				    }

   					imagesList = imagesArrays[+currentPage -1];
   					// res.send(imagesList);
   					res.render('../views/pagination.ejs',{
   						images: imagesList,
	   					pageSize: pageSize,
				        totalImages: totalImages,
				        pageCount: pageCount,
				        currentPage: currentPage
				    });

   				}

   			})

   		}
   	})

}























      
   /*   var pageCount = totalImages/8,
        
        students = [],
        studentsArrays = [], 
        studentsList = [];

    //genreate list of students
    for (var i = 1; i < totalImages; i++) {
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
        totalImages: totalImages,
        pageCount: pageCount,
        currentPage: currentPage
    }); */