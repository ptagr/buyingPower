var express = require('express');
var router = express.Router();
var request = require("request");
var _ = require('underscore')._;


var requestURL = 'http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=hackatha-b572-420a-8b2c-229be6d4a6b7&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=9&itemFilter(0).name=ListingType&itemFilter.value=FixedPrice&outputSelector=SellerInfo&categoryId=';

var itemArray2 = ['161495451444', '381064177054', '271659087994', '191424275863', '321596068196', '261673779913', '271681650066',
    '111526153929', '221614920705'];

var getItemURL = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=hackatha-b572-420a-8b2c-229be6d4a6b7&siteid=0&version=515&IncludeSelector=Details,ShippingCosts&';

router.route('/')
    .get(function (req, res) {
        requestURL = requestURL+req.query.catid;
        request({
                url: requestURL,
                json: true
            }, function (error, response, body) {
            var itemArray = body.findItemsAdvancedResponse[0].searchResult[0].item;
            callAjax(req, res, itemArray);
        });



        //res.send(responsearray);

    });



function callAjax(req, res, itemArray){


    var ajaxCallsRemaining = 9;

    var responsearray = [];
    _.each(itemArray, function (item) {

        var itemURL = getItemURL + 'ItemID=' + item.itemId;
        request({
            url: itemURL,
            json: true
        }, function (error2, response2, body2) {


            if (!error2 && response2.statusCode === 200) {
                var responseObject = {};
                var itm = body2.Item;
                var randomnumber=Math.floor(Math.random()*110)


                responseObject.iteminfo = {
                    id: itm.ItemID,
                    title: truncStr(itm.Title),
                    image: itm.PictureURL[0],
                    condition: 'New',
                    price: trunc(itm.CurrentPrice)
                    //shippingInfo : item.shippingInfo[0]
                };

                responseObject.sellerinfo = {
                    name: itm.Seller.UserID,
                    link: 'http://www.ebay.com/usr/' + itm.Seller.UserID,
                    feedbackScore: itm.Seller.FeedbackScore,
                    positiveFeedbackPercent: itm.Seller.PositiveFeedbackPercent

                };

                responseObject.quantityInfo = {
                    sold: itm.QuantitySold,
                    available: randomnumber
                };

                responseObject.shippingInfo = {
                    cost: trunc(itm.ShippingCostSummary.ShippingServiceCost),
                    type: itm.ShippingCostSummary.ShippingType
                }


                responsearray.push(responseObject);
                console.log("hello" + ajaxCallsRemaining);
                --ajaxCallsRemaining;
                if (ajaxCallsRemaining <= 0) {
                    // all data is here now
                    // look through the returnedData and do whatever processing
                    // you want on it right here
                    res.send(responsearray);
                }
            }

        });


    });
}

var trunc = function(val){
    if(val != undefined)
        return parseFloat(val.Value).toFixed(2);
    else
        return '0.00';
};

var truncStr = function(val){
    if(val.length > 50){
        return val.substring(0,47) + "...";
    }else{
        return val.substring(0,50);
    }

}

module.exports = router;
