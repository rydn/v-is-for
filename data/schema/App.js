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
	},
	processType: {
		type: String,
		default: 'node',
		required: true
	},
	entryPoint: {
		type: String,
		default: 'app.js',
		required: true
	},
	rootPath: {
		type: String,
		default: '/root/apps/app1/',
		required: true
	}
} );
module.exports = $App;