var mongoose = require( 'mongoose' );
var $App = new mongoose.Schema( {
	name: {
		type: String,
		required: true
	},
	domain: {
		type: String,
		required: true
	},
	target: {
		type: String,
		required: true
	}
} );
module.exports = $App;