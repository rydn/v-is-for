var http = require( 'http' ),
	fs = require( 'fs' ),
	util = require( 'util' ),
	every = require( 'fluent-time' ).every,
	EventEmitter = require( 'events' ).EventEmitter,
	statusCodes = http.STATUS_CODES,
	$logger = require( '../lib/logger' );
/*
    Monitor Constructor
*/

function Monitor( opts ) {
	// holds website to be monitored
	this.website = '';
	// ping intervals in minutes
	this.timeout = 30;
	// interval handler
	this.handle = null;
	// initialize the app
	this.init( opts );
	return this;
}
/*
    Inherit from EventEmitter
*/
util.inherits( Monitor, EventEmitter );
/*
    Methods
*/
Monitor.prototype.init = function ( opts ) {
	var timeout = opts.timeout || 30,
		website = opts.website;
	if ( !website ) {
		this.emit( 'error', {
			msg: 'You did not specify a website to monitor'
		} );
		return;
	}
	this.website = website;
	this.timeout = timeout;
	// start monitoring
	this.start( );
};
Monitor.prototype.start = function ( ) {
	var $this = this,
		time = Date.now( );
	$logger.debug( 'starting to monitor: "' + $this.website + '" every ' + $this.timeout + ' seconds' );
	// create an interval for pings
	$this.handle = every( $this.timeout ).seconds( function ( ) {
		$this.ping( );
	} );
};
Monitor.prototype.stop = function ( ) {
	clearInterval( this.handle );
	this.handle = null;
	this.emit( 'stop', this.website );
};
Monitor.prototype.ping = function ( ) {
	var $this = this,
		req;
	
	$this.currentTime = new Date( ).getTime( );
	req = http.request( $this.website, function ( res ) {
		$this.endTime = new Date( ).getTime( );
		// Website is up
		if ( res.statusCode === 200 ) {
			$this.timeTaken = $this.endTime - $this.currentTime;
			$this.isOk( $this.timeTaken );
		}
		// No error but website not ok
		else {
			$this.isNotOk( res.statusCode );
		}
	} );
	req.on( 'error', function ( err ) {
		try {
			var data = $this.responseData( 404, statusCodes[ 404 + '' ] );
			$this.emit( 'error', data );
		} catch ( error ) {
			$logger.error( host.website + ': host down with error, stopping.' );
			$this.stop( );
		}
	} );
	req.end( );
};
Monitor.prototype.isOk = function ( timeTaken ) {
	var data = this.responseData( 200, 'OK', timeTaken );
	this.emit( 'up', data );
};
Monitor.prototype.isNotOk = function ( statusCode ) {
	var msg = statusCodes[ statusCode + '' ],
		data = this.responseData( statusCode, msg );
	this.emit( 'down', data );
};
Monitor.prototype.responseData = function ( statusCode, msg, taken ) {
	var data = Object.create( {} ),
		time = Date.now( );
	data.website = this.website;
	data.time = taken;
	data.statusCode = statusCode;
	data.statusMessage = msg;
	return data;
};
Monitor.prototype.getFormatedDate = function ( time ) {
	var currentDate = new Date( time );
	currentDate = currentDate.toISOString( );
	currentDate = currentDate.replace( /T/, ' ' );
	currentDate = currentDate.replace( /\..+/, '' );
	return currentDate;
};
module.exports = Monitor;