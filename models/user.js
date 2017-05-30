var mongoose = require('mongoose');
var Schema = new mongoose.Schema;

var userSchema = new mongoose.Schema({
    workouts: [String],
    date_Joined: Date,
    name: String,
    email: String,
    password: String,
    current_dumbell_id: String, 
});

module.exports = mongoose.model('User', userSchema);