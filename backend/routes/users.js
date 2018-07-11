var express = require('express');
var router = express.Router();
var user=require('../controllers/user')
/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.render('user',{
    name:[1,2,3,4,5]
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
    'title':'登陆'
  });
});

module.exports = router;
