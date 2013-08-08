var fs = require( 'fs' );
//	configure logger
$log = require( 'tracer' )
	.colorConsole( {
		format: "{{timestamp}} <{{title}}> ({{method}}) [ {{file}}:{{line}} ] =|>	{{message}}",
		dateformat: "HH:MM:s",
		transport: function ( data ) {
			console.log( data.output );
		},
		level: 'info'
	} );
//	export module
module.exports = $log;
