var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var birdSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Bird name is required'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function (n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, bird name must be longer than two characters'
        }
    },
    description: String,
    averageEggs: {
        type: Number,
        min: [1, "Should be at least 1 egg"],
        max: [50, "Should be less than 50 eggs"] },
    height: {
        type: Number,
        min: [1, "Should be at least 1 CM"],
        max: [50, "Should be less than 300 CM"] },
    endangered: {type: Boolean, default: false},
    sightings: [{
        date: {
            type: Date,
            required: true,
            validate: {
                validator: function (d) {
                    return d.getTime() <= Date.now();
                },
                message: 'Date must be a valid date. Date must be now or in the past'
            }
        },
        latitude: {
            type: Number,
            min: [-90, "min of -90"],
            max: [90, "max of 90"]
        },
        longitude: {
            type: Number,
            min: [-180, "min of -180"],
            max: [180, "max of 180"]
        },
    }],
    nest: {
        location: String,
        materials: String
    }
});


var Bird = mongoose.model('Bird', birdSchema);
birdSchema.plugin(uniqueValidator);

module.exports = Bird;