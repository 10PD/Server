var mongoose = require('mongoose');
var Schema = new mongoose.Schema;

var userSchema = new mongoose.Schema({
    workouts: [String],
    date_Joined: Date,
    name: String,
    email: {type : String , unique : true},
    password: String,
    current_dumbell_id: String, 
});

module.exports = mongoose.model('User', userSchema);