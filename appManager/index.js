var path = require( 'path' );
var apacheTail = require( './child' )( {
	// Command to execute
	command: '/usr/local/bin/node',
	// [Optional] Command arguments (same as nodejs.org/api/child_process.html)
	args: [ path.resolve( './app.js' ) ],
	// [Optional] Extra Options (same as nodejs.org/api/child_process.html)
	options: [ ],
	// [Optional] Auto restart?
	autoRestart: false,
	// [Optional] Timeout beetwen restart's
	restartTimeout: 200,
	// [Optional] Callback when the process is Auto-restarted
	cbRestart: function ( data ) {
		console.log( data.toString() )
	},
	// [Optional] On Output
	cbStdout: function ( data ) {
		console.log( data.toString() )
	},
	// [Optional] On Error
	cbStderr: function ( data ) {
		console.log( data.toString() )
	},
	// [Optional] On Exit
	cbClose: function ( exitCode ) {
		console.log( exitCode )
	},
} );
apacheTail.start( );