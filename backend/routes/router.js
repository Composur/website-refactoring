const express = require('express')
const user = require('../controllers/user')
const auth=require('../controllers/auth')
const msgs = require('../controllers/msgs')

module.exports=function(app){
    const api=express.Router();
    // user router
  
    // auth router
    api.get('/login',auth.login)

    api.post('/logout',auth.logout)
    
    // msgs router
    api.post('/subscribe',msgs.add)


    app.use('api',api)
    // app.use('/api', adminApi);
    return api;
}