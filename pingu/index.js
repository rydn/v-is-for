var $logger = require( '../lib/logger' ),
	$DB = require( '../data/' );
var $db = new $DB( );
module.exports = function ( hosts ) {
	//	global object
	var $this = this;
	/////////////////
	//	Variables //
	/////////////////
	//	hosts
	$this.hosts = hosts;
	//	monitor
	$this.mon = require( './monitor' );
	//	monitor jobs collection
	$this.checkers = {};
	//	site status
	$this.statuses = {};
	//	stores check results
	$this.results = {
		//	internal cache
		_cache: [ ],
		/**
		 * add new result to cache
		 *
		 * @method
		 *
		 * @param  {Object} result
		 *
		 * @return {Null}
		 */
		add: function ( result ) {
			$this.statuses[result.website] = result.result;
			$this.results._cache.push( result );
		},
		/**
		 * get either specified sites results or all results
		 *
		 * @method
		 *
		 * @param  {String} site<optional>
		 *
		 * @return {Object}
		 */
		get: function ( site ) {
			if ( site ) {
				return this._cache[ site ];
			} else {
				return this._cache;
			}
		}
	};
	/**
	 * initialise each host in hosts into a monitor
	 *
	 * @method
	 *
	 * @return {Null}
	 */
	$this._init = function ( ) {
		for ( var i = $this.hosts.length - 1; i >= 0; i-- ) {
			if ( $this.hosts[ i ] ) {
				$this.addHost( $this.hosts[ i ] );
				if ( i === 0 ) {
					$logger.debug( 'host monitors initialised, hosts: ' + JSON.stringify( $this.hosts ) );
				}
			}
		}
	};
	$this._checkForExistingHost = function ( host ) {
		for ( var i = $this.hosts.length - 1; i >= 0; i-- ) {
			var currentHost = $this.hosts[ i ];
			if ( $this.checkers[ currentHost ] ) {
				return true;
			} else if ( i === 0 ) {
				return false;
			}
		}
	};
	///////////////
	//	Methods //
	///////////////
	/**
	 * add host to checklist
	 *
	 * @method
	 *
	 * @param  {String} host
	 *
	 * @return {Array}
	 */
	$this.addHost = function ( host ) {
		if ( typeof ( host ) == 'string' ) {
			if ( !this.checkers[ host ] ) {
				//	create new checker instance
				var instance = new $this.mon( {
					website: 'http://' + host,
					timeout: 15
				} );
				//	bind events
				instance.on( 'up', function ( msg ) {
					
					//	save ping to db
					var dbItem = new $db.Ping( {
						url: msg.website,
						latency: msg.time,
						status: 'up'
					} );
					dbItem.save( );
					msg.result = 'up';
				
					$this.results.add( msg );
				} );
				instance.on( 'down', function ( msg ) {
					$logger.debug( msg.website + ': host down' );
					//	save ping to db
					var dbItem = new $db.Ping( {
						url: msg.website,
						latency: -1,
						status: 'down'
					} );
					dbItem.save();
					msg.result = 'down';
					$this.results.add( msg );
				} );
				instance.on( 'error', function ( msg ) {
					$logger.debug( msg.website + ': host error' );
					//	save ping to db
					var dbItem = new $db.Ping( {
						url: msg.website,
						latency: -1,
						status: 'error'
					} );
					dbItem.save();
					msg.result = 'error';
					$this.results.add( msg );
				} );
				instance.on( 'stop', function ( msg ) {
					$logger.debug( msg.website + ': host monitor stopped' );
					//	save ping to db
					var dbItem = new $db.Ping( {
						url: msg.website,
						latency: -1,
						status: 'stopped'
					} );
					dbItem.save();
					msg.result = 'stopped';
					$this.results.add( msg );
				} );
				//	add instance to checkers cache
				$this.checkers[ host ] = instance;
			}
		}
		return $this.hosts;
	};
	/**
	 * remove host from checklist
	 *
	 * @method
	 *
	 * @param  {String} host
	 *
	 * @return {Array}
	 */
	$this.removeHost = function ( host ) {
		for ( var i = $this.hosts.length - 1; i >= 0; i-- ) {
			if ( $this.hosts[ i ] == host ) {
				//	stop running checks
				$this.checkers[ host ].stop( );
				//	delete from array
				delete $this.hosts[ i ];
			}
			if ( i === 0 ) {
				return $this.hosts;
			}
		}
	};
	//	initialise if hosts are present
	if ( $this.hosts ) {
		$logger.debug( 'initialising ' + $this.hosts.length + ' checks' );
		$this._init( );
	}
	//	return an instance
	return $this;
};