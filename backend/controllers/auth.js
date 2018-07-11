var jsonwebtoken = require('jsonwebtoken'),
User = require('../models/users'),
config = require('../config'),
secretKey = config.secretKey,
auditTrail = require('../models/auditTrail');
var bcrypt = require('bcrypt-nodejs');

function createToken(user) {
	// expiresIn = 43200 seconds = 12 Hours
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: 43200
	});

	return token;
}

exports.register = function(req, res, next) {
	var user = new User({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	});
	user.save(function(err) {
		if(err){ return next(err); }

		var token = createToken(user);
		res.json({success: true, token: token});
	});
};
exports.editPassword = function(req,res,next) {
	var data = req.body;
	User.findById(data.id).select('password').exec(function(err,userData){
		if (bcrypt.compareSync(data.currentPassword, userData.password) == true) {
			userData.password = data.newPassword;
			userData.save(function(err) {
				if(err){ return next(err); }
				res.json({success: true});
			});
		} else {
			res.json({message: true});
		}
	});
};

exports.checkTokenExpiry = function(req, res) {
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	if(token) {
		jsonwebtoken.verify(token, config.secretKey, function(err, decoded) {
			if(err) {
				if (err.name == 'TokenExpiredError') {
					return res.json({valid: false, message: "Session has expired!"});
				}
				return res.json({valid: false, message: "Failed to authenticate!"});
			} else {
				return res.json({valid: true});
			}
		})
	} else {
		return res.json({valid: false});
	}
}

exports.login = function(req, res) {

	console.log('login')
	res.render('login',{
		'title':'登陆'
	})	
};

exports.logout = function(req, res) {
	
	res.render('msgs',{
		"name":'name'
	})
}

exports.me = function(req, res) {
	return res.json(req.user);
};
