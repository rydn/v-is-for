var mstats =  require( 'measured' ).createCollection( ),
	redis = require( 'redis' ),
	$logger = require( '../lib/logger' );
var db = redis.createClient( );
//	exposed methods
//	stats
exports.stats = mstats;
exports.getStats= function(){
	return {
		knownAppRequestsPerSecond: mstats.meter( 'knownAppRequestsPerSecond' ).toJSON(),
		allRequestsPerSecond: mstats.meter( 'allRequestsPerSecond' ).toJSON()
	};
};
//	middleware handler
exports.middleware = function ( ) {
	return function ( req, res, next ) {
		
		$logger.trace( '[ ' + req.headers.host + ' ] ' + req.method + ' => "' + req.url + '"' );
		//	capture and record incomming ips and count the number of requests from each
		if ( typeof ( req.client._peername ) !== 'undefined' ) {
			db.zincrby( 'stats:ip', 1, req.client._peername.address );
		}
		//	all valid requests, record user agents and number of requests from each
		if ( typeof ( req.headers ) !== 'undefined' ) {
			db.zincrby( 'stats:user-agent', 1, req.headers[ 'user-agent' ] );
			mstats.meter( 'allRequestsPerSecond' ).mark( );
		}
		//	valid request with known app, record hit for requested app
		if ( typeof ( req.headers.host ) !== 'undefined' ) {
			db.zincrby( 'stats:persite', 1, req.headers.host );
			mstats.meter( 'knownAppRequestsPerSecond' ).mark( );
		}
		next( );
	};
};
