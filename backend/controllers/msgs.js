const Msg = require('../models/msgs')

// team add page
exports.add = function(req, res) {
  
  let _msg
  _msg = new Msg({
    // name: '',
    name: req.body.name,
    email: req.body.email,  
    phone: req.body.phone,
    title: req.body.title,  
    msg: req.body.msg,
    company:req.body.company,
    companySize:req.body.companySize,
    want:req.body.want,
    // location:[{Provinces:req.body.city[0],city:req.body.city[1]}],
    location:[{Provinces:req.body.Provinces,city:req.body.city}]
  })
console.log(_msg)
  _msg.save(function(err, msg) {
    var respObj = {}; //Initial response object

    if(err) {
      respObj = {
          error: `Error trying to subscribe. Please try again.`,
          message: msg
        };
    } else {
      respObj = {
          success: `Success`,
          message: msg
        };
    }

    return res.send(respObj);
  })
}
