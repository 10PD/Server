var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
//mongoose.connect('mongodb://localhost/smartbell');

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
    var dumbellId = req.body.dumbellId;
    //***search for user linked to dumbell id***
    var userId = "184278743";
    var date = new Date();
    var workout = req.body.workout;
    var reps = req.body.reps;
    var form = req.body.form;
    res.json({
        dumbbell_id: dumbellId,
        user_id: "12345678",
        date: date,
        workout: workout,
        reps: reps,
        form: form
    });
    console.log(dumbellId);
    //res.json(req.body.dumbellId);

    var newWorkout = new Workout({

    })
})
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

router.post('/api/authUser', function(req,res){
    //authorise a user against database
})

app.use('/api', router);

app.listen(8080);