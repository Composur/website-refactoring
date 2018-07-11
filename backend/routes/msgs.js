var express = require('express');
var Msg=require('../controllers/msgs')
var router = express.Router();
/* GET users listing. */
router.get('/allMsgs', function(req, res, next) {
  res.render('msgs',{
    name:'123'
  });
});

// Msgs save
router.post('/subscribe',Msg.add)
module.exports = router;