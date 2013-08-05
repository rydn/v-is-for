//	dependencies
var httpProxy = require( 'http-proxy' ),
	every = require( 'fluent-time' ).every,
	_ = require( 'lodash' );
//	modules
var $logger = require( '../lib/logger' ),
	$DB = require( '../data/' );
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
					routes[ $app.domain ] = $app.target;
				} );
				if ( routes ) {
					//	routes
					$this.routes = routes;
					var _config = {
						hostnameOnly: true,
						maxSockets: 500,
						router: $this.routes
					};
					//	start server with instrumentation and handler(which we pass routes to) on incommingPort
					$this.server = httpProxy.createServer( require( './instrument' )( ), require( './handler' )( function ( ) {
						return $this.routes;
					} ) ).listen( $this.incommingPort );
					//	config
					$this.server.httpAllowHalfOpen = true;
					//	log
					$logger.debug( 'proxy routes set as: ' + JSON.stringify( $this.routes ) );
					$logger.info( 'proxy started! available on port: ' + incommingPort );
					//	error events
					$this.server.on( 'clientError', function ( err, req, res ) {
						$logger.error( err );
						$this.hasErr = true;
						$this.error = err;
						res.send( 'error occured' );
					} );
					$this.server.on( 'close', function ( err, req, res ) {
						$logger.error( err );
						$this.hasErr = true;
						$this.error = err;
						res.send( 'error occured' );
					} );
					$this.server.proxy.on( 'proxyError', function ( err, req, res ) {
						$logger.error( err );
						$this.hasErr = true;
						$this.error = err;
						res.send( 'error occured' );
					} );
					//	set interval to update routes
					every( 5 ).seconds( function ( interval ) {
						if ( Math.floor( interval.times / 50 ) ) {
							$logger.info( 'refresh #' + interval.times );
						}
						$this.getRoutes( );
					} );
				}
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
	return $this;
};
module.exports = Proxy;