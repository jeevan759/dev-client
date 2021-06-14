var express = require('express');
var MongoStore = require('connect-mongo');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var dbconnect = require('./backend/lib/connectLib');
var config = require('./backend/config/config');
var user=require('./backend/models/registrationModel');
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
app.use(session({
    secret: 'goutham',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECT_STRING })
  
  }))
  
  app.post('/api/login', function(req, res) {
    user.find(req.body, function(err, data) {
        var response = {success: false, message: 'Login Failed', user: null };
        if (err) { res.status(400).json({ msg: "Failed" }); } else if (data.length == 1) {
            req.session.userid = data[0]._id
            req.session.username = data[0].username
            console.log(req.session)
            response.success = true;
        response.message = 'Login Successful';
        response.user = {username: req.session.username};
            res.json(response);
            

        } else {

            res.redirect("/login");

        }
    });
})
var isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userid)
        next();
    else
        return res.redirect("/login");
}
var isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userid)
        next();
    else
        return res.redirect("/");
}
app.get("/", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/sample.html")
})
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
