var jsonwebtoken = require('jsonwebtoken'),
User = require('../models/user'),
config = require('../../config'),
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
	var agreementStatus = req.body.agreementStat;
	if (agreementStatus == 'accept') {
		User.findOne({
			username: req.body.username,
		}).select('password token role').exec(function(err,user){
			if(err) throw err;

			if(!user){
				res.send({ message: "User doesn't exist."});
			}
			else if(user){
				if (req.body.proceed) {
					
					var validPassword = user.comparePassword(req.body.password);

					if (!validPassword) {
						return res.send({ message: "Invalid Password."});
					} else {
						var token = createToken(user);
						// Log user login
						var newAuditTrail = new auditTrail();
						newAuditTrail.ip_address = req.connection.remoteAddress;
						newAuditTrail.user = user.id;
						newAuditTrail.collection_name = 'user';
						newAuditTrail.message = 'Successfuly login!';
						newAuditTrail.save();

						// Set logged in as true
						user.token = token;
						user.save(function(err, saved) {
							if (err) console.log('Got error when save user');
							return res.json({
								success: true,
								message: "Successfuly login!",
								token: token
							})
						});
					}
				}
				else {

					if (!user.token) {
						var validPassword = user.comparePassword(req.body.password);

						if (!validPassword) {
							res.send({ message: "Invalid Password."});
						} else {
							var token = createToken(user);

							// Log user login
							var newAuditTrail = new auditTrail();
							newAuditTrail.ip_address = req.connection.remoteAddress;
							newAuditTrail.user = user.id;
							newAuditTrail.collection_name = 'user';
							newAuditTrail.message = 'Successfuly login!';
							newAuditTrail.save();

							// Set logged in as true
							user.token = token;
							user.save();

							res.json({
								success: true,
								message: "Successfuly login!",
								token: token
							})
						}
					} else {
						var validPassword = user.comparePassword(req.body.password);
						if (!validPassword) {
							return res.json({ success: false, message: "Invalid Password."});
						}
						if (user.token !== req.body.token) {
							res.json({
								success: false,
								message: "User has already logged into another devices",
								token: false
							});
						} else {
							var token = createToken(user);

							// Log user login
							var newAuditTrail = new auditTrail();
							newAuditTrail.ip_address = req.connection.remoteAddress;
							newAuditTrail.user = user.id;
							newAuditTrail.collection_name = 'user';
							newAuditTrail.message = 'Successfuly login!';
							newAuditTrail.save();

							// Set logged in as true
							user.token = token;
							user.save();

							res.json({
								success: true,
								message: "Successfuly login!",
								token: token
							});
						}
					}
				}
			}
		});
	} else {
		res.json({});
	};
};

exports.logout = function(req, res) {
	var token = req.body.token;
	if (token) {
		jsonwebtoken.verify(token, config.secretKey, function(err, decoded) {
			User.findById(decoded.id).exec(function(err, user) {
				if(err) { return res.status(400).json({message: "User not found!"}) };
				if(user) {
					user.logged_in = false;
					user.token = null;
					user.save(function(err, saved) {
						if(err) { return res.status(500).json({message: "Failed to log out!. Please try again later!"}) };
						res.json({
							success: true,
							message: "Success log out!"
						});
					});
				}
			});
		});
	}
}

exports.me = function(req, res) {
	return res.json(req.user);
};
