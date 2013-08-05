var express = require( "express" ),
	_ = require( 'lodash' ),
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
var app = express( );
//	logging method
app.use( function ( req, res, next ) {
	$logger.trace( '[http] ' + req.method + ' > ' + req.url );
	next( );
} );
// Configuration
app.configure( function ( ) {
	app.set( 'port', process.env.PORT || 5000 );
	app.use( express.bodyParser( ) );
	app.use( express.methodOverride( ) );
	app.use( express.static( __dirname + '/app' ) );
	app.use( app.router );
} );
//	Admin http routes
app.get( '/api/v1/apps', $routes.apps.get );
app.get( '/api/v1/apps/:_id', $routes.apps.query );
app.post( '/api/v1/apps', $routes.apps.post );
app.post( '/api/v1/apps/:_id', $routes.apps.update );
app.del( '/api/v1/apps/:id', $routes.apps.delete );
app.get('/api/v1/appmanager/status', function(req, res){
	var statuses = [];
	_.each($appManager.apps, function(app){
		var proc = $appManager.processes[app.appName];
		statuses.push(proc);
	});
	res.json(statuses);
});
//	Start Admin Http interface
app.listen( app.get( 'port' ), function ( ) {
	$logger.info( "admin interface started! available on port " + app.get( 'port' ) );
	//	init and start apps
	$appManager.loadConfigurations( function ( err, procs ) {
		$appManager.startAll( );
		//	start proxy
		var proxy = new $Proxy( 80 );
		proxy.initRoutesAndStart( );
	} );
} );