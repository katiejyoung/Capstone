var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6060);

var path = require('path'); 
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var path = require('path'); 
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',function(req,res){
    res.render('home');
});

app.get('/user',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('user');
});

app.get('/user/:id', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    res.render('user');
});

app.put('/user/:id', function(req,res,next) {
    res.render('user');
});

app.post('/user/:id', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    res.render('user');
});

app.delete('/user/:id', function(req,res,next) {
    res.render('user');
});

app.get('/editUser',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('editUser');
});

app.get('/editUser:id',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('editUser');
});

app.put('/editUser:id',function(req,res,next){
    res.render('editUser');
});

app.post('/editUser:id',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('editUser');
});

app.get('/createUser',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('createUser');
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
