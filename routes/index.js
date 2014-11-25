var express = require('express');
var router = express.Router();
var url = require('url');
var app = require('../app');
var mongodb = require('mongodb')
    , MongoClient = mongodb.MongoClient;
var mongoURL = process.env.MONGOSOUP_URL;

/* GET home page. */
router.get('/', function(req, res) {
    MongoClient.connect(process.env.MONGOSOUP_URL, function(err, db) {
        if(err) {
            console.log("There is an error");
        }
        var offerCollection = db.collection('test_collection');

        var offer1 = new offerCollection({
            sellerName : 'mountainsrgreat2010',
            sellerFeedback :527,
            itemId : '381064177054',
            title: 'Sandy Starkman hippie boho floral sundress-Larg...',
            imgUrl : "http://i.ebayimg.com/00/s/MTYwMFgxMjAw/z/~OUAAOSwAL9UcqcQ/$_1.JPG?set_id=880000500F",
            itemDesc : " This is an awesome movie",
            listPrice : 20,
            offerPrice: 10,
            savingPrice:10,
            boughtQty:5,
            totalQty:100
        });

        offer1.save(function(err, offerValue) {
            if (err) return console.error(err);
            console.log(offerValue);
        });

        offerCollection.find(function(err, thor) {
            if (err) return console.error(err);
            res.send(thor);
        });

    });



});

router.get('/getOffer*', function(req,res){
    var itemIdVar = req.param("itemid");

    MongoClient.connect(process.env.MONGOSOUP_URL, function(err, db) {
        if(err) {
            console.log("There is an error");
        }
        var offerCollection = db.collection('test_collection');

        offerCollection.findOne({ itemId: itemIdVar}, function(err, thor) {
            if (err) return console.error(err);
            res.send(thor);
            console.log(thor);
        });
    });



});

router.get('/updateOffer*', function(req,res){
    var itemIdVar = req.param("itemid");

    MongoClient.connect(process.env.MONGOSOUP_URL, function(err, db) {
        if(err) {
            console.log("There is an error");
        }
        var offerCollection = db.collection('test_collection');
        offerCollection.update(
            {itemId: itemIdVar},
            { $inc: { boughtQty: -1} }, function(error, updatedValue){
                if(error) {
                    console.log("There is an error");
                }

                offerCollection.findOne({ itemId: itemIdVar}, function(err, thor) {
                    if (err) return console.error(err);
                    res.send(thor);
                    console.log(thor);
                });}
        );
    });



});

router.get('/submitjson*', function(req, res) {
    console.log("Hi");
    var serviceReq = req.body.xorequest;
    console.log(serviceReq);
    console.log(req.method);
    res.send(resString);
    // res.redirect('/');
    res.end();
});

module.exports = router;
