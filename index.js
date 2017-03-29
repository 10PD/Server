var express = require('express');
var app = express();
var mongoose = require('mongoose');
var router = express.Router();

//mongoose.connect('mongodb://localhost/smartbell');

router.get('/', function(req,res){
    res.send("Hi there!");
});
router.get('/linkDumbbell/:id', function(req,res){
    var dumbellId = req.params.id;
    res.send(dumbellId);
});
router.post('/workoutData', function(req,res){
    //store workout data in database
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