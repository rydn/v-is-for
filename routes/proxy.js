var $logger = require( '../lib/logger' ),
	redis = require( 'redis' ),
	_ = require( 'lodash' );
var db = redis.createClient( );
module.exports = {
	restart: function ( $proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function ( req, res ) {
			$logger.info( 'restarting proxy...' );
			$this.proxy.restart( );
			res.json( {
				result: 'restarting'
			} );
		};
	},
	stop: function ( $proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function ( req, res ) {
			$logger.info( 'stopping proxy...' );
			$this.proxy.stop( );
			res.json( {
				result: 'stopping'
			} );
		};
	},
	start: function ( $proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function ( req, res ) {
			$logger.info( 'starting proxy...' );
			$this.proxy.start( );
			res.json( {
				result: 'starting'
			} );
		};
	},
	status: function ( $proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function ( req, res ) {
			res.json( {
				status: $this.proxy.status
			} );
		};
	},
	hits: function ( $proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function ( req, res ) {
			//	get top five for array of member set referances
			var getTop5 = function ( _sets, callback ) {
				var returnO = {};
				var count = 0;
				var requiredLength = _sets.length;
				_.each( _sets, function ( _set ) {
					db.zrevrange( _set, 0, 4, 'withscores', function ( err, members ) {
						count++;
						if ( err ) $logger.error( err );
						else {
							var paramName = _set.replace( 'stats:', '' );
							switch ( paramName ) {
							case 'hits':
								returnO[ paramName ] = members[ 1 ];
								break;
							case 'persite':
								if ( members.length >= 2 ) {
									returnO[ paramName ] = [ ];
									var i = 0;
									while ( i <= members.length ) {
										if ( members[ i + 1 ] ) {
											returnO[ paramName ].push( {
												domain: members[ i ],
												hits: members[ i + 1 ]
											} );
										}
										i = i + 2;
									}
								}
								break;
							default:
								returnO[ paramName ] = members;
								break;
							}
							if ( count >= requiredLength ) {
								callback( returnO );
							}
						}
					} );
				} );
			};
			//	get metrics from proxy
			var metrics = $this.proxy.getStats( );
			var meparams = [ 'mean', 'count', 'currentRate', '1MinuteRate', '5MinuteRate', '15MinuteRate' ];
			_.each( meparams, function ( p ) {
				metrics.knownAppRequestsPerSecond[ p ] = Math.round( metrics.knownAppRequestsPerSecond[ p ] * 100 ) / 100;
				metrics.allRequestsPerSecond[ p ] = Math.round( metrics.allRequestsPerSecond[ p ] * 100 ) / 100;
			} );
			//	define sets to return
			var sets = [ 'stats:persite', 'stats:hits' ];
			//	calll private method
			getTop5( sets, function ( statsReturn ) {
				statsReturn.metrics = metrics;
				//	return to client
				res.json( statsReturn );
			} );
		};
	}
};
