var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/allMsgs', function(req, res, next) {
  res.render('msgs',{
    name:'123'
  });
});
module.exports = router;