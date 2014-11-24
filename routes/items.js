var express = require('express');
var router = express.Router();
var request = require("request");
var _ = require('underscore')._;


var requestURL = 'http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=hackatha-b572-420a-8b2c-229be6d4a6b7&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=10&itemFilter(0).name=ListingType&itemFilter.value=FixedPrice&categoryId=9355&outputSelector=SellerInfo';

var getItemURL = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=hackatha-b572-420a-8b2c-229be6d4a6b7&siteid=0&version=515&IncludeSelector=Details&';

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
                var ajaxCallsRemaining = 10;

                var responsearray =[];
                _.each(itemArray, function(item){

                    var itemURL = getItemURL+'ItemID='+item.itemId[0];
                    request({
                        url: itemURL,
                        json: true
                    }, function(error2, response2, body2){


                        if (!error2 && response2.statusCode === 200) {
                            var responseObject = {};
                            var itm = body2.Item;


                            responseObject.iteminfo  = {
                                id : itm.ItemID,
                                title : itm.Title,
                                image : itm.PictureURL[0],
                                condition : 'New',
                                price : itm.CurrentPrice.Value
                                //shippingInfo : item.shippingInfo[0]
                            };

                            responseObject.sellerinfo = {
                                name : itm.Seller.UserID,
                                link : 'http://www.ebay.com/usr/'+itm.Seller.UserID,
                                feedbackScore : itm.Seller.UserID.FeedbackScore,
                                positiveFeedbackPercent : itm.Seller.UserID.PositiveFeedbackPercent

                            };

                            responseObject.quantityInfo = {
                                sold : itm.QuantitySold,
                                availableHint : itm.QuantityAvailableHint,
                                availableThreshold : itm.QuantityThreshold
                            };

                            responsearray.push(responseObject);

                            --ajaxCallsRemaining;
                            if (ajaxCallsRemaining <= 0) {
                                // all data is here now
                                // look through the returnedData and do whatever processing
                                // you want on it right here
                                res.header('Access-Control-Allow-Credentials','true')
                                res.send(responsearray);
                            }
                        }

                    });




                });

                //res.send(responsearray);

            }
        });
    });

module.exports = router;
