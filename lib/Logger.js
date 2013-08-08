var util = require( 'util' ),
	fs = require( 'fs' ),
	colors = require( 'colors' );
var Logger = function logger( config ) {
	var $this = this;
	///////////////////////
	//	PRIVATE METHODS //
	///////////////////////

	function padZero( number ) {
		var n = String( number );
		if ( number < 10 ) {
			return '0' + n;
		} else {
			return n;
		}
	}

	function pad2Zeros( number ) {
		var n = String( number );
		if ( number < 10 ) {
			return '00' + n;
		} else if ( number < 100 ) {
			return '0' + n;
		} else {
			return n;
		}
	}

	function getDate( ) {
		var now = new Date( );
		return now.getFullYear( ) + '-' + padZero( now.getMonth( ) + 1 ) + '-' + padZero( now.getDate( ) ) + ' ' +
			padZero( now.getHours( ) ) + ':' + padZero( now.getMinutes( ) ) + ':' + padZero( now.getSeconds( ) ) + '.' + pad2Zeros( now.getMilliseconds( ) );
	}

	function getLine( ) {
		var e = new Error( );
		// now magic will happen: get line number from callstack
		var line = e.stack.split( '\n' )[ 3 ].split( ':' )[ 1 ];
		return line;
	}

	function getClass( module ) {
		if ( module ) {
			if ( module.id ) {
				if ( module.id == '.' ) {
					return 'main';
				} else {
					return module.id.substring( config.basedir.length + 1, module.length );
				}
			} else {
				return module.toString( ).substring( module.toString( ).indexOf( '/' + config.basedir ), module.length );
			}
		} else {
			return '<unknown>';
		}
	}

	function getMessage( items ) {
		var msg = [ ],
			i;
		for ( i = 0; i < items.length; i++ ) {
			if ( typeof items[ i ] == 'string' ) {
				msg.push( items[ i ] );
			} else {
				msg.push( util.inspect( items[ i ], false, 10 ) );
			}
		}
		return msg.join( '' );
	}
	////////////
	// init  //
	////////////
	config = config || {};
	var defaultLogLevel = config.level && config.level[ '*' ] || 'trace';
	var logLevels = config.level || {};
	var useColor = config.color || ( config.color == 'auto' && process.env.TERM && process.env.TERM.indexOf( 'color' ) >= 0 );
	colors.setTheme( {
		info: 'green',
		trace: 'grey',
		warn: 'yellow',
		debug: 'cyan',
		error: 'red'
	} );
	$this.logger = function ( module ) {
		var methods = {
			'trace': {
				'color': colors.help,
				'priority': 1
			},
			'debug': {
				'color': colors.debug,
				'priority': 2
			},
			'info': {
				'color': colors.info,
				'priority': 3
			},
			'warn': {
				'color': colors.warn,
				'priority': 4
			},
			'error': {
				'color': colors.error,
				'priority': 5
			}
		};
		var logLevel = logLevels[ getClass( module ) ] || defaultLogLevel;
		var priority = methods[ logLevel ].priority;
		var logger = {};
		var defineMethod = function ( level ) {
			var levelStr = level.toUpperCase( );
			if ( levelStr.length == 4 ) levelStr += ' ';
			if ( useColor ) {
				logger[ level ] = function ( msg ) {
					if ( methods[ level ].priority >= priority ) {
						var colorLevel = methods[ level ].color;
						util.puts( colorLevel( getDate( ) + ' ' + colors.bold( levelStr ) + ' ' + getClass( module ) + ':' + getLine( ) + ' - ' + colors.bold( getMessage( arguments ) ) ) );
					}
				};
			} else {
				logger[ level ] = function ( msg ) {
					if ( methods[ level ].priority >= priority ) {
						util.puts( getDate( ) + ' ' + levelStr + ' ' + getClass( module ) + ':' + getLine( ) + ' - ' + getMessage( arguments ) );
					}
				};
			}
		};
		for ( var level in methods ) {
			defineMethod( level );
		}
		return logger;
	};
	return $this;
};
module.exports = Logger;