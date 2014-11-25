var express = require('express');
var router = express.Router();
var request = require("request");
var _ = require('underscore')._;
var postmark = require("postmark")(process.env.POSTMARK_API_KEY);
var mongoose = require('mongoose');
var getItemURL = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=hackatha-b572-420a-8b2c-229be6d4a6b7&siteid=0&version=515&IncludeSelector=Details,ShippingCosts&';
var proposalURL = 'https://protected-oasis-8857.herokuapp.com/proposalView.html';


var offerSchema = new mongoose.Schema({
    sellerName:{type:String},
    sellerFeedback: Number,
    itemId : { type: String },
    title: { type: String },
    imgUrl:{type:String},
    itemDesc:{type:String},
    listPrice: Number,
    offerPrice: Number,
    savingPrice: Number,
    boughtQty: Number,
    totalQty:Number
});

router.route('/send')
    .get(function (req, res) {
        var acceptLink = 'https://protected-oasis-8857.herokuapp.com/proposal/accept?itemId='+req.query.itemid+'&discount='+req.query.discount+'&totalQty='+req.query.quantity+'&duration='+req.query.duration;
        var emailText = 'Hi '+ req.query.sellerName + ',\n'+
            'Negotiator ' + req.query.negotiatorName + ' has created a group deal for your item '+ req.query.itemid + '.\n'+
            'Please choose to Accept or Reject after reviewing the proposal as detailed below:'+'\n' +
            'Quantity: '+ req.query.quantity +'\n' +
            'Duration: '+ req.query.duration +'\n' +
            'Discount: '+ req.query.discount +'\n' +
            'ACCEPT	: '+acceptLink+
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
        console.log(process.env.MONGOSOUP_URL);

        MongoClient.connect(process.env.MONGOSOUP_URL, function(err, db) {
            if(err) {
                console.log("failed to connect to the database");
            } else {
                console.log("connected to database");
            }

            var itemURL = getItemURL + 'ItemID=' + req.query.itemId;

            request({
                url: itemURL,
                json: true
            }, function (error2, response2, body2) {


                if (!error2 && response2.statusCode === 200) {
                    var responseObject = {};
                    var itm = body2.Item;
                    var collection = db.collection('test_collection');
                    var d = new Date();
                    var resource = {
                        sellerName : itm.Seller.UserID,
                        itemId : itm.ItemID,
                        sellerFeedback : itm.Seller.FeedbackScore,
                        title: itm.Title,
                        imgUrl: itm.PictureURL[0],
                        itemDesc: itm.Title,
                        listPrice: trunc(itm.CurrentPrice.Value),
                        offerPrice: itm.CurrentPrice.Value - req.query.discount ,
                        savingPrice: req.query.discount,
                        boughtQty: 0,
                        totalQty: req.query.totalQty,
                        startTime: d.toString(),
                        totalTime: req.query.duration
                    };
                    collection.insert(resource, function(err, result){
                        if(err)
                            throw err;
                        console.log("entry saved");
                        res.redirect(proposalURL+'?action=accept');

                    });

                }
            });

        });
    });


router.route('/reject')
    .get(function(req, res){
       res.redirect(proposalURL+'?action=reject')
    });

var trunc = function(val){
    return parseFloat(val).toFixed(2);
};

var truncStr = function(val){
    if(val.length > 50){
        return val.substring(0,47) + "...";
    }else{
        return val.substring(0,50);
    }

}

module.exports = router;
