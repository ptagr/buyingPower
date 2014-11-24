var express = require('express');
var router = express.Router();
var request = require("request");


var requestURL = 'http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=hackatha-b572-420a-8b2c-229be6d4a6b7&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=iphone%203g&paginationInput.entriesPerPage=3';

router.route('/')
    .get(function (req, res) {
        request({
            url: requestURL,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log(body) // Print the json response
                res.send(body.findItemsByKeywordsResponse[0].searchResult[0].item);
            }
        });
    });

module.exports = router;
