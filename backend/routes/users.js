var express = require('express');
var router = express.Router();
var user=require('../controllers/user')
var auth=require('../controllers/auth')


router.get('/login',auth.login)

router.post('/login',auth.login)

module.exports = router;
