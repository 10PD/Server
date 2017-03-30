var mongoose = require('mongoose');
var Schema = new mongoose.Schema;

var workoutSchema = new mongoose.Schema({
    dumbbell_id: String,
    user_id: String,
    date: Date,
    workout: String,
    reps: Number,
    form: Number
});



module.exports = mongoose.model('Workout', workoutSchema);