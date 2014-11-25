var express = require('express');
var router = express.Router();
var request = require("request");
var _ = require('underscore')._;
var postmark = require("postmark")(process.env.POSTMARK_API_KEY);

router.route('/send')
    .get(function (req, res) {

        var emailText = 'Hi '+ req.query.sellerName + ',\n'+
            'Negotiator ' + req.query.negotiatorName + ' has created a group deal for your item '+ req.query.itemid + '.\n'+
            'Please choose to Accept or Reject after reviewing the proposal as detailed below:'+'\n' +
            'Quantity: '+ req.query.quantity +'\n' +
            'Duration: '+ req.query.duration +'\n' +
            'Discount: '+ req.query.discount +'\n' +
            'ACCEPT	REJECT'+ '\n\n'+
            'Thanks,'+ '\n'+
            'eBay BuyingPower Team';
        console.log(emailText);
        postmark.send({
            "From": "PUNAGRAWAL@EBAY.COM",
            "To": "punit21@outlook.com",
            "Subject": "You have received a new Negotiator Interest !!",
            "TextBody": emailText,
            "Tag": "big-bang"
        }, function(error, success) {
            if(error) {
                console.error("Unable to send via postmark: " + error.message);
                return;
            }
            console.info("Sent to postmark for delivery")
        });
       res.send(200);
    });


router.route('/accept')
    .get(function(req, res){
        var mongodb = require('mongodb')
            , MongoClient = mongodb.MongoClient;

        MongoClient.connect(process.env.MONGOSOUP_URL, function(err, db) {
            if(err) {
                console.log("failed to connect to the database");
            } else {
                console.log("connected to database");
            }
            var collection = db.collection('grades')
            collection.find({}).toArray(function(err, docs) {
                if (err) {
                    return console.error(err)
                }
                docs.forEach(function(doc) {
                    console.log('found document: ', doc)
                });
            });
        });
    })



module.exports = router;
