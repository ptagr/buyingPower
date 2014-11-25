var express = require('express');
var router = express.Router();
var request = require("request");
var _ = require('underscore')._;
var postmark = require("postmark")(process.env.POSTMARK_API_KEY);


router.route('/')
    .get(function (req, res) {
        postmark.send({
            "From": "PUNAGRAWAL@EBAY.COM",
            "To": "punit21@outlook.com",
            "Subject": "Hello from Postmark",
            "TextBody": "Hello!",
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



module.exports = router;
