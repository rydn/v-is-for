var mstats = require( 'measured' ).createCollection( ),
	redis = require( 'redis' ),
	$logger = require( '../lib/logger' );
var db = redis.createClient( );
//	exposed methods
//	stats
exports.stats = mstats;
exports.getStats = function ( ) {
	return {
		knownAppRequestsPerSecond: mstats.meter( 'knownAppRequestsPerSecond' ).toJSON( ),
		allRequestsPerSecond: mstats.meter( 'allRequestsPerSecond' ).toJSON( )
	};
};
//	middleware handler
exports.middleware = function ( ) {
	return function ( req, res, next ) {
		//	valid request with known app, record hit for requested app
		if ( typeof ( req.headers.host ) !== 'undefined' ) {
			db.zincrby( 'stats:persite', 1, req.headers.host );
			db.zincrby( 'stats:hits', 1, 'hit' );
			mstats.meter( 'knownAppRequestsPerSecond' ).mark( );
			mstats.meter( 'allRequestsPerSecond' ).mark( );
			next( );
		} else {
			res.writeHead( 503 );
			res.end( );
		}
	};
};