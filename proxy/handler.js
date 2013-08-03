var _ = require( 'lodash' ),
	$logger = require( '../lib/logger' );
module.exports = function ( routes ) {
	var $this = this;
	this.routes = $this.routes = routes;
	return  function ( req, res, bounce ) {
		$logger.log(req.headers.host + ' -> '+$this.routes[ req.headers.host ])
		if ( $this.routes[ req.headers.host ] ) {
			bounce( this.routes[ req.headers.host ] );
		} else {
			
			$logger.log( 'incomming request for unknown host: ' + req.headers.host );
			console.log(res);
		}
	};
	
};