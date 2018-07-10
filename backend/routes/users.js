var express = require('express');
var router = express.Router();
var user=require('../controllers/user')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/user', function(req, res, next) {
  res.render('user',{
    name:[1,2,3,4,5]
  })
});
module.exports = router;
