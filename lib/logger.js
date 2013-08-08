var Logger = require( './Logger' ),
	path = require( 'path' );
module.exports = function ( _module ) {
	var logger = new Logger( {
		logLevel: 'trace',
		color: true,
		basedir: path.resolve( './' )
	} ).logger( _module );
	return {
		log: logger.log,
		debug: logger.debug,
		info: logger.info,
		warn: logger.warn,
		trace: logger.trace
	};
};
console.log( path.resolve( './' ) );