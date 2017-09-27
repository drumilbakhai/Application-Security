var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');

exports.connection = function(req,res){
	res.send('Application is up and running');
}