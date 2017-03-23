var mongoose = require('mongoose');
var Schema = new mongoose.Schema;

var workoutSchema = new Schema({
    dumbbell_id: String,
    user_id: String,
    date: Date,
    workout: String,
    reps: Number,
    form: Number
});

var userSchema = new Schema({
    workouts: [String],
    date_Joined: Date,
    email: String,
    password: String,
    current_dumbell_id: String, 
});

module.exports = {workoutSchema, userSchema};