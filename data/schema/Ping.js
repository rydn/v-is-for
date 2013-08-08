var mongoose = require( 'mongoose' );
var $Ping = new mongoose.Schema( {
	time: {
		type: Date,
		default: new Date( )
	},
	url: {
		type: String,
		required: true
	},
	latency: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	timestamp: {
		type: Number,
		default: new Date( )
			.getTime( )
	}
} );
module.exports = $Ping;
