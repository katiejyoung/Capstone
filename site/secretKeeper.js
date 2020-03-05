var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

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

//To encrypt
var masks = require('./public/js/encryptMod.js');
var masksSalt = require('./public/js/encryptModSalt.js');

//To use tokens with functions
var tokenDB = require('./public/js/tokenDB.js');
tokens = tokenDB.createTokens();        //Create map (username = key, attempt number and timestamp = values) when starting server

//To use OTP with functions
var otpDB = require('./public/js/otpDB.js');
otp = otpDB.createOTP();        //Create map (username = key, one-time passcode = values) when starting server

//Basic Home page
app.get('/',function(req,res){
    res.render('home');
});


//PUT to the home page currently takes a username and password and looks for a match in the db 
    //Returned count allows login
    //result[0].total == access count on html
app.put('/',function(req,res,next){
    var uname = masks.removeMask([... req.body.user_name]);
    var upass = masks.removeMask([... req.body.user_pass]);
    var unameE;
    var upassE;

    mysql.pool.query("SELECT salt FROM salts WHERE user_name=?", [uname], function(error, results, fields) {    //Get Salt based on user name
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        var salt = results[0].salt;
        unameE = masksSalt.addMaskSalt([... uname],salt);   //Use salt to encrypt user credentials
        upassE = masksSalt.addMaskSalt([... upass],salt);

        var useTokens = takeToken([uname].toString());      //Get token to initiate rate limiting based on username
        useTokens.then(() =>
            mysql.pool.query("SELECT COUNT(1) AS total FROM userE WHERE user_name=? and user_password=?", [unameE, upassE], function(error, results, fields) {
                if (error) {
                    console.log(JSON.stringify(error));
                    return;
                }
                const now = Date();
                console.log("Login attempt: ", uname," p: ", upass,  " @: ", now);
                res.send(results);
            })
        );
    })
});

//GET to user page renders 2FA
app.get('/2FA/:user_name&:password', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    var uname = masks.removeMask([... req.params.user_name]);
    var upass = masks.removeMask([... req.params.password]);
    const now = Date();
    console.log("Getting 2FA page for: ", [uname]," @: ", now);
    getUser(res, mysql, context, uname, upass, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('2FA',context);
        }
    }
});

//PUT to the 2FA page currently takes a username and email
    //Sends validation email with a one-time passcode
    //Returned OTP value used for user input validation
app.put('/2FA',function(req,res,next){
    var uname = masks.removeMask([... req.body.user_name]);
    var uemail = req.body.user_email;
    var pin = sendValidationEmail(uname, uemail);

    var otpPair = takeOTP([uname].toString(), pin);

    res.send(otpPair.passcode);
});

//Basic page returning FAQ comment list
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
    var context = {};
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
    var uname = masks.removeMask([... req.body.user_name]);
    mysql.pool.query('SELECT COUNT(1) AS total FROM salts WHERE user_name=?', [uname], function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.send(results);
    })
});

//POST to create user page creates a new user with no administrative access
    //Success redirects to the home page to allow user to log in with new credentials
app.post('/createUser',function(req,res,next){
    var salt = Math.floor(Math.random() * 900000000) + 100000000; //Generate 9 digit salt
    console.log(salt);
    var unameE = masksSalt.addMaskSalt([... req.body.username],salt);
    var upassE = masksSalt.addMaskSalt([... req.body.password],salt);
    var uemailE = masksSalt.addMaskSalt([... req.body.email],salt);

    mysql.pool.query('INSERT INTO salts (user_name, salt) VALUES (?,?)', [req.body.username, salt], function(error, rows, fields) {     //Add new username and salt to salts table
        if (error) {
            console.log(JSON.stringify(error));
            next(error);
            return;
        }

        mysql.pool.query('INSERT INTO userE (user_name, user_password, user_email, user_super) VALUES (?,?,?,?)', [unameE, upassE, uemailE, 0], function(error, rows, fields) { //Add encrypted user data to user table
            if (error) {
                console.log(JSON.stringify(error));
                next(error);
                return;
            }
            res.redirect('/');
        })
    })
});

//GET to user page returns all the user records
    //function checks for admin profile to get ALL users' info passed to page
    //getX functions perform sql Select statements and store info in context array
    //complete function makes sure the appropriate getX functions have been called before context is passed
app.get('/user/:user_name&:password', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    var uname = masks.removeMask([... req.params.user_name]);
    var upass = masks.removeMask([... req.params.password]);
    const now = Date();
    console.log("Getting user page for: ", [uname]," @: ", now);
    if (uname == 'Admin' && upass == 'password'){       //If user is admin, get data for admin table
        getAdmin(res, mysql, context, complete);
        getUser(res, mysql, context, uname, upass, complete);
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
        getUser(res, mysql, context, uname, upass, complete);   //If user is normal, get user and record data
        getRecords(res, mysql, context, uname, upass, complete);
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
    var rnameE = masks.addMask([... req.body.record_name]);     //Mask the record values
    var rpassE = masks.addMask([... req.body.record_password]);
    var rurlE = masks.addMask([... req.body.record_URL]);

    mysql.pool.query("UPDATE recordsE SET record_name=?, record_data=?, record_URL=? WHERE record_id=?", [rnameE, rpassE, rurlE, req.body.record_id],   //Use record ID to update record
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
    var rnameE = masks.addMask([... req.body.add_record_name]);
    var rpassE = masks.addMask([... req.body.add_record_password]);
    var rurlE = masks.addMask([... req.body.add_record_URL]);

    mysql.pool.query('INSERT INTO recordsE (record_name, record_data, record_URL, user) VALUES (?,?,?,?)',[rnameE, rpassE, rurlE, req.body.add_record_user], function(error, rows, fields) {    //Use user ID to insert new record
        if (error) {
            console.log(JSON.stringify(error));
            next(error);
            return;
        }
        res.redirect('/user/'+[req.params.user_name]+'&'+[req.params.password]);
    })
});

//DELETE to the user page deletes a record via the record ID
    //Success is ultimately a reload of the user page (via JS on the html file)
app.delete('/user/:user_name&:password', function(req,res,next) {
    mysql.pool.query('DELETE FROM recordsE WHERE record_id=?', req.body.record_id, function(error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        res.status(202).end();
    })
});

//GET to the editUser page returns all of the user info via the getUser function
app.get('/editUser/:user_name&:password',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    var uname = masks.removeMask([... req.params.user_name]);
    var upass = masks.removeMask([... req.params.password]);
    getUser(res, mysql, context, uname, upass, complete);
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
    var uname = masks.removeMask([... req.params.user_name]);
    var upass = masks.removeMask([... req.params.password]);
    var unameE;
    var upassE;
    var uemailE;
    mysql.pool.query("SELECT salt FROM salts WHERE user_name=?", [uname], function(error, results, fields) {    //Get Salt based on user name
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        var salt = results[0].salt;     //Get encrypted user credentials using salt
        unameE = masksSalt.addMaskSalt([... uname],salt);
        upassE = masksSalt.addMaskSalt([... upass],salt);
        uemailE = masksSalt.addMaskSalt([... req.body.user_email],salt);

        mysql.pool.query("UPDATE userE SET user_password=?, user_email=? WHERE user_name=?", [upassE, uemailE, unameE],
        function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                return;
            }
            res.status(200);
            res.end();
        })
    })
});

//DELETE to the user page deletes a user profile
//Success is ultimately a reload of the user page (via JS on the html file)
app.delete('/editUser/:user_name&:password', function(req,res,next) {
    var uname = masks.removeMask([... req.body.user_name]);
    var upass = masks.removeMask([... req.body.user_password]);
    var unameE;
    var upassE;
    mysql.pool.query("SELECT salt FROM salts WHERE user_name=?", [uname], function(error, results, fields) {    //Get Salt based on user name
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        var salt = results[0].salt;     //Get encrypted user credentials using salt
        unameE = masksSalt.addMaskSalt([... uname],salt);
        upassE = masksSalt.addMaskSalt([... upass],salt);

        mysql.pool.query('DELETE FROM userE WHERE user_name=? AND user_password=?', [unameE, upassE], function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                return;
            }
            res.status(202).end();
        })
    })
});

//Error Pages
app.use(function(req,res){
    res.status(404);
    res.render('404');  //Dont send error data, instead use preplanned error statement
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');  //Dont send error data, instead use preplanned error statement
});

//Server Port
app.listen(app.get('port'), function(){
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

//GETX FUNCTIONS
    //SQL statements for which the results are stored in the passed array context
    //The passed function complete renders the context array on the html when it is appropriate

//Get Records for User Page
function getRecords(res, mysql, context, id, pass, complete)
{
    var unameE;
    var upassE;
    mysql.pool.query("SELECT salt FROM salts WHERE user_name=?", [id], function(error, results, fields) {   //Get salt for encryptions
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        var salt = results[0].salt;
        unameE = masksSalt.addMaskSalt([... id],salt);  //encrypt user credentials
        upassE = masksSalt.addMaskSalt([... pass],salt);
    
        mysql.pool.query("SELECT * FROM recordsE r INNER JOIN userE u ON r.user = u.id WHERE u.user_name=? and u.user_password=?", [unameE, upassE], function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                return;
            }
            var resultArray = JSON.parse(JSON.stringify(results));  //Convert results object to JSON
            resultArray.forEach(function(v){ 
                v.record_name = masks.removeMask([... v.record_name]);  //decrypt records data
                v.record_data = masks.removeMask([... v.record_data]);
                v.record_URL = masks.removeMask([... v.record_URL]);
            });
            context.records=resultArray;    //send record data to records
            complete();
        })
    })
}

//Get Individual User Data
function getUser(res, mysql, context, id, pass,complete)
{
    var unameE;
    var upassE;
    mysql.pool.query("SELECT salt FROM salts WHERE user_name=?", [id], function(error, results, fields) {   //Get salt for encryptions
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        var salt = results[0].salt;
        unameE = masksSalt.addMaskSalt([... id],salt);  //encrypt user credentials
        upassE = masksSalt.addMaskSalt([... pass],salt);

        mysql.pool.query("SELECT * FROM userE WHERE user_name=? and user_password=?", [unameE, upassE], function(error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error));
                return;
            }
            var resultArray = JSON.parse(JSON.stringify(results));  //Convert results object to JSON
            resultArray.forEach(function(v){ 
                v.user_name = masksSalt.removeMaskSalt([... v.user_name], salt);    //decrypt user data
                v.user_password = masksSalt.removeMaskSalt([... v.user_password], salt);
                v.user_email = masksSalt.removeMaskSalt([... v.user_email], salt);
            });
            context.user=resultArray;   //send user data to user
            complete();
        })
    })
}

//Get data for Admin table
function getAdmin(res, mysql, context, complete)
{
    mysql.pool.query("SELECT * FROM salts WHERE NOT user_name=?", "Admin", function(error, results, fields) {   //Get username salt combinations except for admin
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        var resultArray = JSON.parse(JSON.stringify(results));  //Convert results object to JSON
        resultArray.forEach(function(v){ 
            unameE = masksSalt.addMaskSalt([... v.user_name],v.salt);   //Use salt to get encrypted username

            mysql.pool.query("SELECT * FROM userE WHERE user_name=?", unameE, function(error, resu, fields) {   //use encrypted username to get encrypted user data
                if (error) {
                    console.log(JSON.stringify(error));
                    return;
                }
                var resultPass = JSON.parse(JSON.stringify(resu));  //Convert results object to JSON
                resultPass.forEach(function(p){ 
                    v.user_name = masksSalt.removeMaskSalt([... p.user_name], v.salt);      //decrypt user data
                    v.user_password = masksSalt.removeMaskSalt([... p.user_password], v.salt);
                });
            })
        });
        context.admin=resultArray;  //Pass all decrypted user info to admin
        complete();
    });
}

//Get Comments for FAQ and admin table
function getComment(res, mysql, context, complete)
{
    mysql.pool.query("SELECT * FROM questions",function(error, results, fields) {   //Get all comments for admin use
        if (error) {
            console.log(JSON.stringify(error));
            return;
        }
        context.questions=results;  //send comments data to questions
        complete();
    });
}


//Token Functions
    //Source: https://levelup.gitconnected.com/rate-limiting-a0783293026a
//Get Delay function
    //Increase numbers to make the rate limiter greater per failed attempt
function getDelay(attempts) {
    return 1000 * Math.pow(2, attempts);
}

//Take function
    //Creates a token if there is no token in the map with username as key
    //If there is a token, increases the attempt and sets timestamp
function take(oldToken, now) {
    if (typeof oldToken == 'undefined') {
      return { attempts: 0, timestamp: now };
    }
    return {
      attempts: oldToken.attempts + 1,
      timestamp: Math.max(oldToken.timestamp + getDelay(oldToken.attempts),now) };
}

//Take Token Function
    //Gets an old and new token based on the username
    //Compares timestamp to limit rate if needed
    //Promise keeps function from completing until the limit time has passed
function takeToken(key) {
    const now = Date.now();
    const nowLog = Date();
    const oldToken = tokenDB.getToken(key, tokens);
    const newToken = take(oldToken, now);
    tokenDB.replaceToken(key, newToken, oldToken, tokens);   // avoid concurrent token usage
    if (newToken.timestamp - now > 0) {
        console.log("Delay initiated: ", (newToken.timestamp - now),  " @: ", nowLog);
        return new Promise(r => setTimeout(r, newToken.timestamp - now));
    }
    return new Promise(r => setTimeout(r, newToken.timestamp - now));
}

// Source: https://www.w3schools.com/nodejs/nodejs_email.asp
function sendValidationEmail(uname, uemail) {
    //console.log(uemail);
    var pin = generateCode().toString();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'secretkeepercapstone@gmail.com',
            pass: '$ecret*Keeper#Capstone2020'
        }
    });
    var mailOptions = {
        from: 'secretkeepercapstone@gmail.com',
        to: uemail,
        subject: 'Your One-Time Passcode',
        text: pin
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return pin;
}

//
function generateCode() {
    var pin = Math.floor(0 + Math.random() * 999999);
    return pin;
}

//Create function
    //Creates an OTP using username as key
function createOTP(pin) {
    return { passcode: pin };
}

//Take OTP Function
    //Gets an old and new OTP based on the username
    //Returns otp
function takeOTP(key, pin) {
    const oldOTP = otpDB.getOTP(key, otp);
    const newOTP = createOTP(pin);
    otpDB.replaceOTP(key, newOTP, oldOTP, otp);   // avoid concurrent otp usage
    return otpDB.getOTP(key, otp);
}