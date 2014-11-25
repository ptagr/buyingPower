var request = require("request");
var http = require('http');

exports.confirm = function(req, res) {
	console.log(req.params.itemid);
	getResponse(req.params.itemid, res);
  
};

function getResponse(itemid, res) {
	var count =0;
	request({
        url: "http://10.225.82.190:3000/updateoffer?itemid=381064177054",
        json: true
    }, function (error2, response2, body2) {
    	console.log(body2);
    	res.render('confirm', body2);
    	
    });
}
	
/*function getJsonResponse(itemid) {
		

		var options = {
		  host: 'http://10.225.82.190',
		  path: '/getoffer?itemid=123450',
		  port: '3000',
		  //This is the only line that is new. `headers` is an object with the headers to request
		  headers: {'custom': 'Custom Header Demo works'}
		};

		callback = function(response) {
		  var str = ''
		  response.on('data', function (chunk) {
			  console.log(chunk);
		    str += chunk;
		  });

		  response.on('end', function () {
		    console.log(str);
		  });
		}

		var req = http.request(options, callback);
		req.end();
	}*/
	
	/*var jsonRes = {
			title: "iPhone 6 for sale",
			imgUrl: "http://img.grouponcdn.com/deal/2qhU11uLfqzcFRootgST/pB-4200x2544/v1/c700x420.jpg",
			itemDesc: "Great deal of iPhone 6",
			sellerName: "bestbuy",
			sellerFeedback: "99",
			listPrice: "$500",
			offerPrice: "$300",
			savingPrice: "$200",
			boughtQty: 12,
			remainingQty: 88
		};
	return jsonRes; */

