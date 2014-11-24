var express = require('express');
var router = express.Router();
var request = require("request");
var _ = require('underscore')._;


var requestURL = 'http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=hackatha-b572-420a-8b2c-229be6d4a6b7&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=10&itemFilter(0).name=ListingType&itemFilter.value=FixedPrice&categoryId=9355&outputSelector=SellerInfo';
router.route('/')
    .get(function (req, res) {
        request({
            url: requestURL,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log(body) // Print the json response
                //res.send(body.findItemsByKeywordsResponse[0].searchResult[0].item);

                var itemArray = body.findItemsAdvancedResponse[0].searchResult[0].item;

                var responsearray =[];
                _.each(itemArray, function(item){
                    var responseObject = {};
                    responseObject.iteminfo  = {
                        id : item.itemId[0],
                        title : item.title[0],
                        image : item.galleryURL[0],
                        condition : item.condition[0].conditionDisplayName[0],
                        price : item.sellingStatus[0].currentPrice[0].__value__
                        //shippingInfo : item.shippingInfo[0]
                    };
                    responseObject.sellerinfo = {
                        name : item.sellerInfo[0].sellerUserName[0],
                        link : 'http://www.ebay.com/usr/'+item.sellerInfo[0].sellerUserName[0],
                        feedbackScore : item.sellerInfo[0].feedbackScore[0],
                        positiveFeedbackPercent : item.sellerInfo[0].positiveFeedbackPercent[0]

                    }
                    responsearray.push(responseObject);
                });
                res.send(responsearray);

            }
        });
    });

module.exports = router;
