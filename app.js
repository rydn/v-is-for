var express = require( "express" ),
	$logger = require( './lib/logger' ),
	$Proxy = require( './proxy/' ),
	$DB = require( './data/' ),
	$AppManager = require( './appManager/' ),
	$routes = require( './routes/' );
//	connect to db
var $db = new $DB( );
var $appManager = new $AppManager( {
	monitor: true
} );
$db.connect( );
var $proxy = new $Proxy( 80 );
var app = express( );
// Configuration
app.configure( function ( ) {
	app.set( 'port', process.env.PORT || 5000 );
	app.use( express.bodyParser( ) );
	app.use( express.methodOverride( ) );
	app.use( express.static( __dirname + '/app' ) );
	app.use( app.router );
} );
//	Admin http routes
//	apps
app.get( '/api/v1/apps', $routes.apps.get );
app.get( '/api/v1/apps/:_id', $routes.apps.query );
app.post( '/api/v1/apps', $routes.apps.post );
app.post( '/api/v1/apps/:_id', $routes.apps.update );
app.del( '/api/v1/apps/:id', $routes.apps.delete );
//	app manager
app.get( '/api/v1/appmanager/status', $routes.appManager.status( $appManager ) );
app.post( '/api/v1/appmanager/restartall', $routes.appManager.restartAll( $appManager ) );
app.post( '/api/v1/appmanager/stopall', $routes.appManager.stopAll( $appManager ) );
app.post( '/api/v1/appmanager/startall', $routes.appManager.startAll( $appManager ) );
//	proxy
app.get( '/api/v1/proxy/status', $routes.proxy.status( $proxy ) );
app.get( '/api/v1/proxy/hits', $routes.proxy.hits( $proxy ) );
app.post( '/api/v1/proxy/restart', $routes.proxy.restart( $proxy ) );
app.post( '/api/v1/proxy/stop', $routes.proxy.stop( $proxy ) );
app.post( '/api/v1/proxy/start', $routes.proxy.start( $proxy ) );
//	pings
app.get( '/api/v1/pings', $routes.pings.getAll );
app.get( '/api/v1/pings/bysite/:site', $routes.pings.getForSite );
app.get( '/api/v1/pings/bystatus/:status', $routes.pings.getForStatus );
app.get( '/api/v1/pings/query/:site/:status', $routes.pings.getQuery );
app.get( '/api/v1/pings/chartquery/:site', $routes.pings.chartEndpoint );
app.get( '/api/v1/pings/status', $routes.pings.getStatuses( $proxy ) );
//	Start Admin Http interface
app.listen( app.get( 'port' ), function ( ) {
	$logger.info( "admin interface started! available on port " + app.get( 'port' ) );
	//	init and start apps
	$appManager.loadConfigurations( function ( err, procs ) {
		//	start app manager
		$appManager.startAll( );
		//	start proxy
		$proxy.initRoutesAndStart( );
	} );
} );
