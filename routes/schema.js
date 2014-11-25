var mongoose = require('mongoose');

var offerSchema = new mongoose.Schema({

	sellerName : {
		type : String
	},

	sellerFeedback : Number,

	itemId : {
		type : String
	},

	title : {
		type : String
	},

	imgUrl : {
		type : String
	},

	itemDesc : {
		type : String
	},

	listPrice : Number,

	offerPrice : Number,

	savingPrice : Number,

	boughtQty : Number,

	totalQty : Number

});

module.exports = mongoose.model('OfferCollection', offerSchema);