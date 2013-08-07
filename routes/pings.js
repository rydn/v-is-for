var $DB = require( '../data/' ),
	$logger = require( '../lib/logger' );
var $db = new $DB( );
module.exports = {
	getAll: function ( req, res ) {
		var skip = req.query.skip || 0;
		var limit = req.query.limit || 20;
		$db.Ping.find( ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				res.json( pings );
			}
		} );
	},
	getForSite: function ( req, res ) {
		var skip = req.query.skip || 0;
		var limit = req.query.limit || 20;
		$db.Ping.find( {
			url: 'http://' + req.params.site
		} ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				res.json( pings );
			}
		} );
	},
	getForStatus: function ( req, res ) {
		var skip = req.query.skip || 0;
		var limit = req.query.limit || 20;
		var requestedStatus = req.params.status;
		$db.Ping.find( {
			status: requestedStatus
		} ).skip( skip ).limit( limit ).exec( function ( err, pings ) {
			if ( err ) {
				logger.error( err );
				res.end( 503 );
			} else {
				res.json( pings );
			}
		} );
	},
	getQuery: function ( req, res ) {
		var skip = req.query.skip || 0;
		var limit = req.query.limit || 20;
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
				res.json( pings );
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
						url: property,
						status: status,
						status_num: status_num
					} );
				}
			}
			res.json( returnA );
		};
	}
};