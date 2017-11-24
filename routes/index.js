var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

var api_key = process.env.GOOGLE_MAP_API;

/* GET home page. */
router.get('/', function(req, res, next) {
    Bird.find().select( { name: 1, description: 1 } ).sort( { name: 1} )
        .then( ( docs ) => {
        console.log(docs);
        res.render('index', {title: 'All Birds', birds: docs});
    }).catch ( (err) => {
        next(err)
    });
});

router.post('/addBird', function (req, res, next) {
    console.log(req.body);

    console.log("endangered:");
    console.log(req.body.endangered);

    var bird = Bird(req.body);

    bird.nest = {
        location: req.body.nestLocation,
        materials: req.body.nestMaterials
    };


    bird.save()
        .then( (doc) => {
            console.log(doc);
            res.redirect('/')
        }).catch( (err) => {

        if( err.name  === 'ValidationError' ) {
            req.flash('error', err.message);
            res.redirect('/')
        }
        else if (err.code === 11000 ){
            req.flash('error', req.body.name + ' is already in db');
            res.redirect('/');
        }
        next(err);
    });
});

router.post('/deleteBird', function (req, res, next) {

    Bird.deleteOne({_id: req.body._id })
        .then( (result) =>{
            if (result.deletedCount === 1) {
                req.flash('info', 'Bird Deleted');
                res.redirect('/');
            } else {
                res.status(404).send("Error deleting bird: not found");
            }
        })
        .catch((err) => {
                next(err);
            }
        );
});

router.post('/editBird', function (req, res, next) {

    var nest = {
        location: req.body.nestLocation,
        materials: req.body.nestMaterials
    };

    Bird.findOneAndUpdate({_id: req.body._id },
        {$set:
            {
                name: req.body.name,
                description: req.body.description,
                averageEggs: req.body.averageEggs,
                height: req.body.height,
                nest: nest
            }
        })
    .then( (doc) => {
        if (doc) {
            if (doc) {
                req.flash('info', req.body.name + ' Edited');
                res.redirect('/bird/' + req.body._id);
            }
        }
    });

});

router.post('/addSightings', function (req, res, next) {

    console.log(req.body.date);

    var sighting = {
        date: req.body.date,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };

    console.log(sighting)

    // finds bird object by id and adds a sighting
    Bird.findOneAndUpdate( {_id: req.body._id }, {$push: { sightings: sighting } }, {runValidators: true} )
        .then( (doc) => {
            if (doc) {
                res.redirect('/bird/' + req.body._id);
            } else {
                res.status(404); next(Error("attempting to add sighting to bird not in db"))
            }
        })
        .catch( (err) => {
            console.log(err);

            if (err.name === 'CastError') {
                req.flash('error', 'Date must be in a valid format');
                res.redirect(/bird/ + req.body._id);
            } else if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                res.redirect(/bird/ + req.body._id);
            }
            next(err);
        })
});


router.get('/bird/:_id', function(req, res, next){

    console.log(req.body);

    Bird.findOne( {_id: req.params._id })
        .then( (doc) => {
            if (doc) {
                res.render('bird', { bird: doc, key: api_key } );
            } else {
                res.status(404);
                next(Error("Bird not found"));
            }
        })
});

router.get('/bird/:_id/sightings', function(req, res, next){
    Bird.findOne( {_id: req.params._id })
        .then( (doc) => {
            if (doc) {

                // console.log(doc.sightings);

                var sightings = [];

                for (var i = 0; i < doc.sightings.length; i++) {
                    console.log("doc.sightings[i]");
                    console.log(doc.sightings[i]);
                    var place = { lat: doc.sightings[i].latitude, lng: doc.sightings[i].longitude }
                    console.log(place);
                    sightings.push(place);
                }

                console.log(sightings[0].toString());


                res.render('json', { layout: false, json: JSON.stringify(sightings) } );
            } else {
                res.status(404);
                next(Error("Bird not found"));
            }
        })
});

module.exports = router;
