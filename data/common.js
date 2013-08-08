var $logger = require( '../lib/logger' ),
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	db = mongoose.connection;
//	bind to console
db.on( 'error', console.error.bind( console, 'connection error:' ) );
//	on connect
db.once( 'open', function callback( ) {
	$logger.info( 'Connected to db' );
} );
//	expose module
module.exports = {
	db: db,
	Schema: Schema,
	mongoose: mongoose,
	ObjectId: ObjectId,
	Types: mongoose.Types
};
