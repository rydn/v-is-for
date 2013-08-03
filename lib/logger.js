var fs = require('fs');
//	configure logger
$log = require( 'tracer' )
	.colorConsole( {
		format: "{{timestamp}} |> {{title}}  {{file}}:{{line}}	-> {{message}}",
		dateformat: "HH:MM:ss",
		transport: function ( data ) {
			console.log( data.output );
		}
	} );
//	export module
module.exports = $log;