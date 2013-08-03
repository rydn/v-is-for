var bouncy = require( 'bouncy' ),
	handler = require( './handler' ),
	$logger = require( '../lib/logger' );
/**
 * main proxy interface
 * @param  {Number} incommingPort
 */
var Proxy = function ( incommingPort, routes ) {
	var $this = this;
	//	set proxys port
	$this.incommingPort = incommingPort || 80;
	//	routes
	$this.routes = routes || {
		'test.foobar.com': 'localhost:9000'
	};
	$logger.debug( 'configured routes: ' + require( 'util' ).inspect( routes ) );
	//	set the handler for the proxy
	$this.server = bouncy( handler( $this.routes ) );
	//	start serving requests
	$this.listen = function ( ) {
		$this.server.listen( incommingPort );
		$logger.info( 'proxy server up and running on port: ' + incommingPort );
	};
	return $this;
};
module.exports = Proxy;