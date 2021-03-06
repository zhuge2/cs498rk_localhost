var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
	address				: String,  //required
	city				: String,  //required
	hostName			: String,  //required
	hostID				: String,
	// bio 				: String,  //shouldn't this be for the user?
	description			: String, //description might work better than bio
	price				: String,
	roomType			: String,
	dateStart			: String,
	dateEnd				: String,
	activities			: [String], // trip itinerary
	tags				: [String],
	pendingTravelers	: [String], //list of IDs
	currentTraveler		: String,
	currentTravelerName	: String


});

module.exports = mongoose.model('Listing', listingSchema);
