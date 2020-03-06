var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6061);

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

//PUT to the home page currently takes a username and password and looks for a match in the db 
    //(may move if using a PUT for this is poor form)
    //Returned count allows login
    //result[0].total == access count on html
app.put('/',function(req,res,next){
    mysql.pool.query("SELECT COUNT(1) AS total FROM user WHERE user_name= '" + req.body.user_name + "' and user_password='" + req.body.user_pass + "'", function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        console.log("Login attempt: ", req.body.user_name," p: ", req.body.user_pass);
        res.send(results);
    })
});

//Basic page with no functionality
app.get('/user',function(req,res,next){
    res.render('user');
});

//Basic page
app.get('/faq',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getComment(res, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('faq', context);
        }
    }
});

//POST to FAQ page creates a new question
//Success renders the FAQ page to allow user to view the new comment
app.post('/faq',function(req,res,next){
    req.content = req.body.content;
    if ((req.body.content != undefined) && (req.body.content != ''))
    {
        mysql.pool.query(
            "INSERT INTO questions (question_content) VALUES ('"+req.body.content+"')",function(error, rows, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                next(error);
                return;
            }
            res.redirect(req.get('referer'));
        })
    }
    else
    {
        return;
    }
    
});

//DELETE to the faq page deletes a question via the question_content
    //Success is ultimately a reload of the admin user page (via JS on the html file)
app.delete('/faq', function(req,res,next) {
    mysql.pool.query(
        'DELETE FROM questions WHERE question_content=?', req.body.question_content, function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                return;
            }
            res.status(202).end();
        }
    )
});

//PUT faq
app.put('/faq',function(req,res,next){
    mysql.pool.query("UPDATE questions SET question_response ='"+ req.body.question_response + "' WHERE question_content='"+ req.body.question_content + "'", function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.status(202).end();
    })
});

//Basic page with no functionality
app.get('/createUser',function(req,res,next){
    res.render('createUser');
});

//PUT to the create user page currently takes a username and looks for a match in the db 
    //(This is currently exploited with the brute pass attack code)
    //Returned count allows for creation of a profile (need unique username)
    //result[0].total == access count on html
app.put('/createUser',function(req,res,next){
    mysql.pool.query("SELECT COUNT(1) AS total FROM user WHERE user_name='" + req.body.username + "'", function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        //console.log(results);
        res.send(results);
    })
});

//POST to create user page creates a new user with no administrative access
    //Success redirects to the home page to allow user to log in with new credentials
app.post('/createUser',function(req,res,next){
    mysql.pool.query(
        'INSERT INTO user (user_name, user_password, user_email, user_super) VALUES (?,?,?,?)',
        [req.body.username, req.body.password, req.body.email, 0],
         function(error, rows, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                next(error);
                return;
            }
            res.redirect('/');
        }
    )
});

//GET to user page returns all the user records
    //function checks for admin profile to get ALL users' info passed to page
    //getX functions perform sql Select statements and store info in context array
    //complete function makes sure the appropriate getX functions have been called before context is passed
app.get('/user/:user_name&:password', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    console.log("Getting user page for: ", req.params.user_name, req.params.password);
    if (req.params.user_name == 'Admin' && req.params.password == 'password'){
        getAdmin(res, mysql, context, complete);
        getUser(res, mysql, context, req.params.user_name, req.params.password, complete);
        getComment(res, mysql, context, complete);
        function complete()
        {
            callbackCount++;
            if (callbackCount >= 3)
            {
                res.render('user',context);
            }
        }
    }
    else {
        getUser(res, mysql, context, req.params.user_name, req.params.password, complete);
        getRecords(res, mysql, context, req.params.user_name, req.params.password, complete);
        function complete()
        {
            callbackCount++;
            if (callbackCount >= 2)
            {
                res.render('user',context);
            }
        }
    }

});

//PUT to user page updates the records via the record id
    //Success is ultimately a reload of the user page (via JS on the html file)
app.put('/user/:user_name&:password', function(req,res,next) {
    mysql.pool.query("UPDATE records SET (record_name, record_data, record_URL) WHERE record_id='" + req.body.record_name + "','" + req.body.record_password+"','"+req.body.record_URL+"','"+req.body.record_id+"'",
    function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.status(200);
        res.send();
    });
});

//POST to user page inserts a new record via the record user
    //Success reloads the user page with the new record
app.post('/user/:user_name&:password', function(req,res,next) {
    const buf = new Buffer(req.body.add_record_name);   //Use buffer to take advantage of overflow exploit
    mysql.pool.query(
        "INSERT INTO records (record_name, record_data, record_URL, user) VALUES ('"+ buf + "','"+req.body.add_record_password+"','"+req.body.add_record_URL+"','"+req.body.add_record_user+"')", function(error, rows, fields) {
            if (error) {
                next(error);
                return;
            }
            res.redirect('/user/'+[req.params.user_name]+'&'+[req.params.password]);
        }
    )
});

//DELETE to the user page deletes a record via the record ID
    //Success is ultimately a reload of the user page (via JS on the html file)
app.delete('/user/:user_name&:password', function(req,res,next) {
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

//GET to the editUser page returns all of the user info via the getUser function
app.get('/editUser/:user_name&:password',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getUser(res, mysql, context, [req.params.user_name], [req.params.password], complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('editUser',context);
        }
    }
});

//PUT to the editUser page updates user info
    //Success reloads the editUser page with the username and potentially new password
    //Currently username is not allowed to be changed, but it is not the primary key for users (so it can be implemented later)
app.put('/editUser/:user_name&:password',function(req,res,next){
    mysql.pool.query("UPDATE user SET user_password=?, user_email=? WHERE user_name=?", [req.params.password, req.body.user_email, [req.params.user_name]],
    function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.status(200);
        res.end();
    });
});

//DELETE to the user page deletes a user profile
    //Success is ultimately a reload of the user page (via JS on the html file)
    app.delete('/editUser/:user_name&:password', function(req,res,next) {
        mysql.pool.query(
            'DELETE FROM user WHERE user_name=? AND user_password=?', [req.body.user_name, req.body.user_password], function(error, results, fields) {
                if (error) {
                    console.log(JSON.stringify(error));
                    return;
                }
                res.status(202).end();
            }
        )
    });

app.use(function(req,res){
    var context = {};
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    var context = {};
    context.err = err;    //Pass error for weak security
    res.status(500);
    res.render('500', context);
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

//GETX FUNCTIONS
    //SQL statements for which the results are stored in the passed array context
    //The passed function complete renders the context array on the html when it is appropriate

function getRecords(res, mysql, context, id, pass, complete)
{
    mysql.pool.query("SELECT * FROM records r INNER JOIN user u ON r.user = u.id WHERE u.user_name='" + id + "' and u.user_password='" + pass + "'", function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.records=results;
        complete();
    });
}

function getUser(res, mysql, context, id, pass,complete)
{
    mysql.pool.query("SELECT * FROM user WHERE user_name='" + id + "' and user_password='" + pass + "'", function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.user=results;
        complete();
    });
}

function getAdmin(res, mysql, context, complete)
{
    mysql.pool.query("SELECT * FROM user WHERE NOT user_name=?", "Admin", function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.admin=results;
        complete();
    });
}

function getComment(res, mysql, context, complete)
{
    mysql.pool.query("SELECT * FROM questions",function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.questions=results;
        complete();
    });
}