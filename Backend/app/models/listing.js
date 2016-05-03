var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
	address				: String,  //required
	hostName			: String,  //required
	hostID				: String,
	bio 				: String,  //shouldn't this be for the user?
	description			: String, //description might work better than bio
	price				: Number,
	roomType			: String,
	date				: String,
	tags				: [String],
	currentTraveler		: String,
	currentTravelerName	: String


});

module.exports = mongoose.model('Listing', listingSchema);
