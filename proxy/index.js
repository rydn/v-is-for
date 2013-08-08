//	dependencies
var httpProxy = require( 'http-proxy' ),
	_ = require( 'lodash' );
//	modules
var $logger = require( '../lib/logger' ),
	$DB = require( '../data/' ),
	$Pingu = require( '../pingu/' );
var $db = new $DB( );
$db.connect( );
/**
 * main proxy interface
 * @param  {Number} incommingPort
 */
var Proxy = function ( incommingPort ) {
	var $this = this;
	//	set proxys port
	$this.incommingPort = incommingPort || 80;
	$this.hasErr = false;
	$this.error = '';
	//	get stats from instrumentation
	$this.stats = require( './instrument' )
		.stats;
	$this.hosts = [ ];
	/**
	 * start proxy with config pulled from db and transformed
	 * @return {Function}
	 */
	$this.initRoutesAndStart = function ( ) {
		//	get app configs from db
		$db.App.find( function ( err, $apps ) {
			if ( err ) $logger.error( err );
			else {
				//	map returned object as domain:target hash
				var routes = {};
				_.each( $apps, function ( $app ) {
					$this.hosts.push( $app.target );
					$this.hosts.push( $app.domain );
					routes[ $app.domain ] = $app.target;
				} );
				if ( routes ) {
					//	routes
					$this.routes = routes;
					var _config = {
						hostnameOnly: true,
						maxSockets: 100000,
						router: $this.routes
					};
					var instrument = require( './instrument' );
					httpProxy.setMaxSockets( 5000 );
					//	start server with instrumentation and handler(which we pass routes to) 
					$this.server = httpProxy.createServer( instrument.middleware( ), require( './handler' )( function ( $proxy ) {
						return $this.routes;
					} ) );
					//	start listening on incommingPort
					$this.server.listen( $this.incommingPort );
					//	expose stats methods
					$this.stats = instrument.stats;
					$this.getStats = instrument.getStats;
					//	config
					$this.server.httpAllowHalfOpen = true;
					//	log
					$logger.debug( 'proxy routes set as: ' + JSON.stringify( $this.routes ) );
					$logger.info( 'proxy started! available on port: ' + incommingPort );
					$this.status = 'running';
					//	error events
					$this.server.on( 'clientError', function ( err ) {
						if ( err ) {
							$logger.debug( 'clientError||' + err );
							$this.hasErr = true;
							$this.error = err;
							$this.status = 'error: ' + err;
						}
					} );
					$this.server.on( 'close', function ( err ) {
						if ( err ) {
							$logger.debug( 'close||' + err );
							$this.hasErr = true;
							$this.error = err;
							$this.status = 'error: ' + err;
						}
					} );
					$this.server.proxy.on( 'proxyError', function ( err ) {
						if ( err ) {
							$logger.debug( 'proxyError|| ' + err );
							$this.hasErr = true;
							$this.error = err;
						}
					} );
				}
				//	add checks for all hosts
				$this.pingu = new $Pingu( $this.hosts );
			}
		} );
	};
	/**
	 * update routes
	 *
	 * @method
	 *
	 * @return {Null}
	 */
	$this.getRoutes = function ( ) {
		//	get app configs from db
		$db.App.find( function ( err, $apps ) {
			//	map returned object as domain:target hash
			var routes = {};
			_.each( $apps, function ( $app ) {
				routes[ $app.domain ] = $app.target;
			} );
			if ( routes ) $this.routes = routes;
		} );
	};
	/**
	 * shutdown server and reinit
	 *
	 * @method
	 *
	 * @return {Function}
	 */
	$this.restart = function ( ) {
		$this.server.close( );
		$this.initRoutesAndStart( );
	};
	/**
	 * stop proxy server
	 *
	 * @method
	 */
	$this.stop = function ( ) {
		$this.server.close( );
		$this.status = 'stopped';
	};
	/**
	 * start proxy server
	 *
	 * @method
	 */
	$this.start = function ( ) {
		$this.initRoutesAndStart( );
		$this.status = 'running';
	};
	//	return instance
	return $this;
};
module.exports = Proxy;
