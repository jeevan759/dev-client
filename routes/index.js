var express = require('express');
var router = express.Router();
var userLib=require('../backend/lib/userLib');
var user=require('../backend/models/registrationModel');
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
router.post('/api/login',function(req,res){
  userLib.isUserValid(req.body,function(resultJson){
      if(resultJson.success==true){
        //console.log("Session for User Initialized");
        //req.session.user = {username: resultJson.username};
      }
      res.json(resultJson);
     })
})
router.post("/regis",function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var birthday=req.body.birthday;
  var gender=req.body.gender;
  //var first=req.body.username;
  var email=req.body.email;
  var phonenumber=req.body.phonenumber;
  var data={
      "username":username,
      "password":password,
      "birthday":birthday,
      "gender":gender,
      "email":email,
      "phonenumber":phonenumber
  }
  user.insertMany(data,(err,collection)=>{
      if(err)
      {
          throw err;
      }
      console.log(data);
  });
});
router.get('/mailbox', function(req, res) {
  // if this is a valid user having session, return his mailbox
  if(req.session && req.session.user){
      // User is authenticated and his session table has an entry, so we know his username
      // Can we get his details from db?
      // Can we make a db call using userLib or mailboxLib to get his data and return back?
      res.json({success:true, username:req.session.user.username, 'mailbox': req.session.user.username});
  }
  else{
      // Redirect him to login page
      res.json({success:false, message:'Need to be logged in to get mailbox'});
  }
});

module.exports = router;
