var userModel=require('../models/registrationModel');
module.exports.isUserValid=function(userJson,cb){
    var query = {username: userJson.username, password:userJson.password, isDeleted:{$ne : true}};

    userModel.find(query, function(err, collections){
        var response = {success: false, message: 'Login Failed', user: null };
        if(err){
            response.message = 'Server Side Error Occured, Try again after some time';
            return cb(response);
        }
        if(collections.length==0){
            response.message = 'Invalid username/password';
            return cb(response);
        }
        response.success = true;
        response.message = 'Login SuccessFul';
        response.user = {username: collections[0].username,phonenumber: collections[0].phonenumber,date:collections[0].date,email:collections[0].email};
        cb(response);
    })
}
module.exports.search=function(userJson,cb){
    var query = {username: userJson};

    userModel.find(query, function(err, collections){
        var response = {success: false, message: 'Login Failed', user: null };
        if(err){
            response.message = 'Server Side Error Occured, Try again after some time';
            return cb(response);
        }
        if(collections.length==0){
            response.message = 'Invalid username/password';
            return cb(response);
        }
        response.success = true;
        response.message = 'Login SuccessFul';
        response.user = {username: collections[0].username};
        cb(response);
    })
}
module.exports.getall = function(req,res)
{
var query = {};
userModel.find(query, function(err, obj){
if(err)
console.log("ERROR: "+err);
res.send(obj);
});
}

module.exports.update = function(req,res)
{
   // console.log(req);
   var user=req.params.user;
   //var username=req.body.username;
    var obj = userModel.find({username: user},function(err,obj){
        console.log(user);
    userModel.findByIdAndUpdate(obj[0]._id, {username: JSON.stringify(req.body.username),date: JSON.stringify(req.body.date),email: JSON.stringify(req.body.email),phonenumber: JSON.stringify(req.body.phonenumber)},
     function (err, docs) {
    if (err){
console.log(err)
}
else{
console.log("Updated User : ", docs);
}
});
    })
}