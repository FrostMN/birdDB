var mongoose = require('mongoose');

var birdSchema = new mongoose.Schema({
    name: String,
    description: String,
    averageEggs: Number,
    endangered: Boolean,
    datesSeen: [ Date ]
});

var Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird;