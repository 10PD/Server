var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require("./config.js");

var app = express();
var router = express.Router();

app.set('secret', config.secret);
mongoose.connect('mongodb://localhost/smartbell');


var User = require('./models/user.js');
var Workout = require('./models/workout');

/*function checkToken(req)
{
    console.log("Check hit");
    var token = req.body.token || req.headers['token'];
    if(token){
        jwt.verify(req.body.token, app.get('secret'), function(err, data){
            if(err){
                //res.json({success:false, message:"Couldn't verify user", error: err, token: req.params.token});
                return false;
            } else {
                var userId = data._doc._id;
                User.findOne({"_id":userId}, function(err, user){
                if(err){
                    //res.json({"status":"fail", "message": err});
                    return false;
                } else {
                    var token = jwt.sign(user, app.get('secret'), {expiresIn: 1440});
                    res.json({
                        success: true,
                        message: 'Token generated for 24 hours',
                        token: token
                    });
                    return true;
                    //res.json({success:true, message: "user validated"});
                    }
                })
            }
        })
    } else {
        return false;
    }
}
*/

/*app.get("/api/workoutData", function(req, res, next)
{
    if(checkToken(req))
    {
        next();
    } else {
        res.json({"status": false, "message": "Please use a valid token next time"});
    }
    jwt.verify(req.headers.token, app.get('secret'), function(err, data){
        if(err){
            res.json({"status": false, "message": err});
        } else {
            //res.json(data._doc);
            next();
        }
    })
    next();
})*/

app.use(bodyParser.json());

router.get('/', function(req,res){
    res.send("Hi there!");
});

router.get('/linkDumbbell/:id', function(req,res){
    var dumbellId = req.params.id;
    res.send(dumbellId);
});

router.post('/workoutData', function(req,res){
    //store workout data in database
    var dumbellId = req.body.dumbell_id;
    //res.json({"id": dumbellId});
    User.findOne({"current_dumbell_id": dumbellId}, function(err, data){
        if(err){
            res.json({"status":"fail", "message": err});
        } else {
            //res.json(data);
            var userId = data._id;
            var date = new Date();
            var workout = req.body.workout;
            var reps = req.body.reps;
            var form = req.body.form;
            
            var newWorkout = new Workout({
                dumbbell_id: dumbellId,
                user_id: userId,
                date: date,
                workout: workout,
                reps: reps,
                form: form
            });
            newWorkout.save(function(err, obj){
                User.findOneAndUpdate({"_id":obj.user_id}, {$set:{"current_dumbell_id":null}, $push:{"workouts":obj._id}}, function(err, data){
                    if(err){
                        res.json({"status":false, "message": err});
                    } else {
                        res.json(data);
                    }
                });
            });
        }
    });
})

router.get('/workoutData/', function(req,res){
    //return workout data for a specific user
    jwt.verify(req.headers.token, app.get('secret'), function(err, data){
        if(err){
            res.json({"status": false, "message": err});
        } else {
            //res.json(data._doc.workouts);
            var workoutIds = data._doc.workouts;
            var workouts = new Array();
            for(i = 0; i < workoutIds.length; i++){
                Workout.findOne({_id: workoutIds[i]}, function(err, data){
                    if(err){
                        res.json({"status": false, "message": err});
                    } else {
                        //res.json({"status": true, "data": data});
                        workouts.push(data);
                    }
                })
            }
            res.json({"status": true, "data": workouts});
        }
    })
})

router.post('/authUser', function(req,res){
    var userEmail = req.body.email;
    var userPass = req.body.password;

    User.findOne({"email":userEmail}, function(err, data){
        if(err){
            res.json({"status":"fail", "message": err});
        } else {
            if(userPass = data.password)
            {
                var token = jwt.sign(data, app.get('secret'), {expiresIn: 1440});
                res.json({
                    success: true,
                    message: 'Token generated for 24 hours',
                    token: token
                });
            }
        }
    })
})

router.post('/registerUser', function(req,res){
    var userName = req.body.name;
    var userEmail = req.body.email;
    var userPass = req.body.password;

    User.find({"email": userEmail}, function(err, data){
        if(err)
        {
            console.log(err);
        } else {
            console.log(data.length);
            if(data.length == 0){
                console.log("true");
                var newUser = new User({
                    name: userName,
                    email: userEmail,
                    password: userPass,
                    date_Joined: new Date(),
                    current_dumbell_id:""
                });
                newUser.save(function(err,obj){
                    if(err){
                        res.json({"status":"fail", "message": err});
                    } else {
                        var token = jwt.sign(obj, app.get('secret'), {expiresIn: 1440});
                        res.json({
                            success: true,
                            message: 'Token generated for 24 hours',
                            token: token
                        });
                    }
                });
            } else {
                console.log("false");
                res.json({"status": false, "message":"According to us you already exists, try a different email"});
            }
        }
    })
})
app.use('/api', router);

app.listen(8080);