var $logger = require( '../lib/logger' )( module ),
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	db = mongoose.connection;
//	on error
db.on( 'error', function ( err ) {
	$logger.trace( 'mongoose connection error: ' + err.toString( ) );
} );
//	on connect
db.once( 'open', function callback( ) {
	$logger.info( 'mongoose connection established' );
} );
//	expose module
module.exports = {
	db: db,
	Schema: Schema,
	mongoose: mongoose,
	ObjectId: ObjectId,
	Types: mongoose.Types
};