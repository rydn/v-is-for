var _ = require( 'lodash' ),
	$DB = require( '../data/' ),
	$logger = require( '../lib/logger' );
var $db = new $DB( );
module.exports = {
	getAll: function ( req, res ) {
		var skip = Number( req.query.skip ) || 0;
		var limit = Number( req.query.limit ) || 15;
		$db.Ping.find( ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				var retData = {
					data: pings,
					next: '/api/v1/pings?skip=' + ( skip + limit ),
					prev: ( skip - limit ) >= 0 ? '/api/v1/pings?skip=' + ( skip - limit ) : '/api/v1/pings'
				};
				res.json( retData );
			}
		} );
	},
	getForSite: function ( req, res ) {
		var skip = Number( req.query.skip ) || 0;
		var limit = Number( req.query.limit ) || 15;
		$db.Ping.find( {
			url: 'http://' + req.params.site
		} ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				var retData = {
					data: pings,
					next: '/api/v1/pings/bysite/' + req.params.site + '?skip=' + ( skip + limit ),
					prev: ( skip - limit ) >= 0 ? '/api/v1/pings/bysite/' + req.params.site + '?skip=' + ( skip - limit ) : '/api/v1/pings/bysite/' + req.params.site
				};
				res.json( retData );
			}
		} );
	},
	getForStatus: function ( req, res ) {
		var skip = Number( req.query.skip ) || 0;
		var limit = Number( req.query.limit ) || 15;
		var requestedStatus = req.params.status;
		$db.Ping.find( {
			status: requestedStatus
		} ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				var retData = {
					data: pings,
					next: '/api/v1/pings/bystatus/' + requestedStatus + '?skip=' + ( skip + limit ),
					prev: ( skip - limit ) >= 0 ? '/api/v1/pings/bystatus/' + requestedStatus + '?skip=' + ( skip - limit ) : '/api/v1/pings/bystatus/' + requestedStatus
				};
				res.json( retData );
			}
		} );
	},
	getQuery: function ( req, res ) {
		var skip = Number( req.query.skip ) || 0;
		var limit = Number( req.query.limit ) || 15;
		var requestedStatus = req.params.status;
		var requestedSite = req.params.site;
		$db.Ping.find( {
			status: requestedStatus,
			url: 'http://' + requestedSite
		} ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				var retData = {
					data: pings,
					next: '/api/v1/pings/query/' + requestedSite + '/' + requestedStatus + '?skip=' + ( skip + limit ),
					prev: ( skip - limit ) >= 0 ? '/api/v1/pings/query/' + requestedSite + '/' + requestedStatus + '?skip=' + ( skip - limit ) : '/api/v1/pings/query/' + requestedSite + '/' + requestedStatus + '/'
				};
				res.json( retData );
			}
		} );
	},
	getStatuses: function ( $proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function ( req, res ) {
			var returnA = [ ];
			for ( var property in $this.proxy.pingu.statuses ) {
				if ( $this.proxy.pingu.statuses.hasOwnProperty( property ) ) {
					var status = $this.proxy.pingu.statuses[ property ];
					var status_num;
					if ( status == 'up' ) status_num = 1;
					else if ( status == 'down' ) status_num = 0;
					else status_num = -1;
					returnA.push( {
						url: property.replace( 'http://', '' ),
						status: status,
						status_num: status_num
					} );
				}
			}
			res.json( returnA );
		};
	},
	chartEndpoint: function ( req, res ) {
		var requestedSite = req.params.site;
		$db.Ping.find( {
			url: 'http://' + requestedSite
		}, function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				var values = _.map(pings, function(ping){
					return [ping.timestamp, ping.latency];
				});
				res.json({key:requestedSite, values: values});
			}
		} );
	}
};