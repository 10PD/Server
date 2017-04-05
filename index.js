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
                        res.json({"status":"fail", "message": err});
                    } else {
                        res.json(data);
                    }
                });
            });
        }
    });
})

/*res.json({
    dumbbell_id: dumbellId,
    user_id: userId,
    date: date,
    workout: workout,
    reps: reps,
    form: form
});*/

router.get('/workoutData/:id', function(req,res){
    //return workout data for a specific user
    var userId = req.params.id;
    res.json({
        dumbbell_id: '123456',
        user_id: userId,
        date: '12/03/2017',
        workout: 'Bicep Curl',
        reps: '30',
        form: '95'
    })
})
//CHANGE TO ACT AS MIDDLEWARE
router.post('/authUser', function(req,res){
    //authorise a user against database
})

router.post('/registerUser', function(req,res){
    var userEmail = req.body.email;
    var userPass = req.body.password;
    //res.json({"Email": userEmail, "Password":userPass});
    var newUser = new User({
        email: userEmail,
        password: userPass,
        date_Joined: new Date(),
        current_dumbell_id:"1234567890"
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
    /*User.findOne({"email":userEmail}, function(err,data){
        if(err){
            res.json({"status":"fail", "message": err});
        } else {
            res.json(data);
        }
    })*/
})
app.use('/api', router);

app.listen(8080);