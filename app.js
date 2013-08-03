var express = require( "express" ),
	_ = require( 'lodash' ),
	$logger = require( './lib/logger' ),
	$Proxy = require( './proxy/' ),
	$DB = require( './data/' ),
	$routes = require( './routes/' );
var app = express( );
app.use( express.logger( ) );
// Configuration
app.configure( function ( ) {
	app.set( 'port', process.env.PORT || 5000 )
	app.use( express.bodyParser( ) );
	app.use( express.methodOverride( ) );
	app.use( express.static( __dirname + '/app' ) );
	app.use( app.router );
} );
//	Admin http routes
app.get( '/api/v1/apps', $routes.apps.get );
app.post( '/api/v1/apps', $routes.apps.post );
app.delete('/api/v1/apps/:_id', $routes.apps.delete);
//	Start Admin Http interface
app.listen( app.get( 'port' ), function ( ) {
	$logger.info( "Listening on " + app.get( 'port' ) );
	proxyStart( );
} );
/**
 * start proxy with config pulled from db and transformed
 * @return {Function}
 */

function proxyStart( ) {
	var $db = new $DB( );
	$db.connect( );
	//	get app configs from db
	$db.App.find( function ( err, $apps ) {
		if ( err ) $logger.error( err );
		else {
			//	map returned object as domain:target hash
			var routes = _.map( $apps, function ( $app ) {
				var O = new Object( );
				O[ $app.domain ] = $app.target;
				return O;
			} );
			if ( routes ) {
				//	configure and start proxy
				var $proxy = $Proxy( 80, routes[0] );
				$proxy.listen( );
			}
		}
	} );
}