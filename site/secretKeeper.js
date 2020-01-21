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


app.get('/test',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getTest(res, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('test',context);
        }
    }
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

function getTest(res, mysql, context, complete) {
    mysql.pool.query("SELECT * FROM Test", function(error, results, fields){
        if(error){
            console.log(error);
        }
        context.name = results;
        console.log(context.name);
        complete();
})
}