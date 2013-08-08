var $logger = require( '../lib/logger' ),
	httpProxy = require( 'http-proxy' );
//	module
module.exports = function ( $Routes ) {
	var $this = this;
	$this.routes = $Routes( );
	/**
	 * private method for getting hostname from string
	 *
	 * @method getHostname
	 *
	 * @param  {String}    str
	 *
	 * @return {String}
	 */

	function getHostname( str ) {
		var re = new RegExp( '^(?:f|ht)tp(?:s)?\://([^/]+)', 'im' );
		return str.match( re )[ 1 ].toString( );
	}
	//	bring routes into namespace then return handler
	return function ( req, res, proxy ) {
		var buffer = httpProxy.buffer( req );
		var route = $this.routes[ req.headers.host ];
		if ( route ) {
			if ( route.indexOf( 'http://' ) == -1 ) {
				route = 'http://' + route;
			}
			var pathO = {
				hostname: getHostname( route ),
				port: 0
			};
			//	seperate hostname and port
			pathO.port = Number( pathO.hostname.substring( pathO.hostname.indexOf( ':' ) + 1, pathO.hostname.length ) );
			pathO.hostname = req.headers.host.split( ':' )[ 0 ];
			//	if port and host are present proxy the request
			if ( ( pathO.port ) && ( pathO.hostname ) ) {
				proxy.proxyRequest( req, res, {
					host: pathO.hostname,
					port: pathO.port,
					buffer: buffer
				} );
			} else {
				$logger.error( JSON.stringify( pathO ) + ' incomplete' );
				res.writeHead( 503 );
				res.end( );
			}
		} else {
			$logger.debug( 'unknown route requested, host: ' + req.headers.host );
			res.writeHead( 404 );
			res.end( );
		}
	};
};
