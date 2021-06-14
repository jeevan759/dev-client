var express = require('express');
var MongoStore = require('connect-mongo');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var dbconnect = require('./backend/lib/connectLib');
var config = require('./backend/config/config');
require('./backend/lib/dbUsersBootstrap').createUsers();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userLib=require('./backend/lib/userLib');

var app = express();
dbconnect.connect();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/login',function(req,res){
    htmlBase=__dirname+'/public/index.html';
    res.sendFile(htmlBase);
})
/*app.post('/api/login',function(req,res){
    userLib.isUserValid(req.body,function(resultJson){
        if(resultJson.success==true){
          //console.log("Session for User Initialized");
          //req.session.user = {username: resultJson.username};
        }
        res.json(resultJson);
       })
})*/
app.use(session({
    resave:false, 
    saveUninitialized:false, 
    secret:config.sessionSecret, 
    store: MongoStore.create({ mongoUrl: config.mongoConnectionString })
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/check',function(req,res){
    path=__dirname+'/public/sample.html';
    res.sendFile(path);
})
app.get('/register',function(req,res){
    path=__dirname+'/public/registration.html';
    res.sendFile(path);
})
module.exports = app;
