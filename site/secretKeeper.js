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
    res.render('test');
});

app.get('/user',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('user');
});

app.get('/editUser',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('editUser');
});

app.get('/createUser',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    res.render('createUser');
});

app.put('/createUser',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT COUNT(1) AS total FROM user WHERE user_name=?', [req.body.username], function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        console.log(results);
        res.send(results);
    })
});

app.post('/createUser',function(req,res,next){
    var context = {};
    mysql.pool.query(
        'INSERT INTO user (user_first, user_last, user_name, user_password, user_email, user_super) VALUES (?,?,?,?,?,?)',
        [req.body.first, req.body.last, req.body.username, req.body.password, req.body.email, 0],
         function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/');
        }
    )
});

app.get('/user/:user_name&:password', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    getUser(res, mysql, context, [req.params.user_name],[req.params.password], complete);
    getRecords(res, mysql, context, [req.params.user_name],[req.params.password], complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 2)
        {
            res.render('user',context);
        }
    }
});

app.put('/user/:user_name&:password', function(req,res,next) {
    mysql.pool.query("UPDATE records SET record_name=?, record_data=?, record_URL=? WHERE record_id=?", [req.body.record_name, req.body.record_password, req.body.record_URL, req.body.record_id],
    function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.status(200);
        res.send();
    });
});

app.post('/user/:user_name&:password', function(req,res,next) {
    var context = {};
    mysql.pool.query(
        'INSERT INTO records (record_name, record_data, record_URL, user) VALUES (?,?,?,?)',
        [req.body.add_record_name, req.body.add_record_password, req.body.add_record_URL,req.body.add_record_user], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/user/'+[req.params.user_name]+'&'+[req.params.password]);
        }
    )
});

app.delete('/user/:user_name&:password', function(req,res,next) {
    console.log(req.body);
    console.log(req.body.record_id);
    mysql.pool.query(
        'DELETE FROM records WHERE record_id=?', req.body.record_id, function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                return;
            }
            res.status(202).end();
        }
    )
});

app.get('/editUser/:user_name&:password',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getUser(res, mysql, context, [req.params.user_name],[req.params.password], complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('editUser',context);
        }
    }
});

app.put('/editUser/:user_name&:password',function(req,res,next){
    console.log(req.body.user_first,req.body.user_last, req.body.user_password, req.body.user_email, [req.params.user_name],[req.params.password]);
    mysql.pool.query("UPDATE user SET user_first=?, user_last=?, user_password=?, user_email=? WHERE user_name=?", [req.body.user_first,req.body.user_last, req.params.password, req.body.user_email,[req.params.user_name]],
    function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.status(200);
        res.end();
    });
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

function getRecords(res, mysql, context, id, pass, complete)
{
    mysql.pool.query("SELECT * FROM records r INNER JOIN user u ON r.user = u.id WHERE u.user_name=? and u.user_password=?", [id, pass], function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.records=results;
        console.log(context.records);
        complete();
    });
}

function getUser(res, mysql, context, id, pass,complete)
{
    mysql.pool.query("SELECT * FROM user WHERE user_name=? and user_password=?", [id, pass], function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.user=results;
        console.log(context.user);
        complete();
    });
}
