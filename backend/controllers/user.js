var jsonwebtoken = require('jsonwebtoken'),
mongoose = require('mongoose'),
User = require('../models/users');

exports.param = function(req, res, next, value) {
	var query = User.findById(value);

	query.exec(function(err, user) {
		if (err) { return next(err); }
		if (!user) { return (new Error('Cannot find the user.'));}
		req.user = user;
		return next();
	});
};

exports.list = function(req, res, next) {
	User.find(function(err, users){
		if(err){ return next(err); }
		res.json(users);
	});
};

exports.view = function(req, res, next) {
	res.json(req.user);
};

exports.checkUnique = function(req, res, next) {
	var filter = {username: req.body.username};
	if (req.body.id) {
		filter._id = {'$ne': mongoose.Types.ObjectId(req.body.id) };
	}
	User.find(filter, function(err, users){
		if(err){ return next(err); }
		var isValid = !users.length;
		res.json({ valid: isValid});
	});
};

exports.create = function(req, res, next) {
	var user = new User({username: req.body.username, password: req.body.password});
	user.save(function(err) {
		if(err){ return next(err); }
		res.json(user);
	});
};

exports.update = function(req, res, next) {
	var user = req.user;

	user.username = req.body.username;
	if (req.body.password) {
		user.password = req.body.password;
	}
	user.save(function(err) {
		if(err){ return next(err); }
		res.json(user);
	});
};

exports.delete = function(req, res, next) {
	req.user.remove(function(err, data) {
		if(err){ return next(err); }
		res.json({ message: 'User is successfully deleted' });
	});
};

