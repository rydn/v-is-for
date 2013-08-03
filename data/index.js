var mongoose = require('mongoose');
/**
 * data access interface
 * @param  {String} connectionString
 */
var Data = function ( connectionString ) {
	//	scope
	var $this = this;
	//	global config
	$this.connectionString = connectionString || 'mongodb://localhost/visfor';
	$this.common = require( './common' );
	//	Schema
	$this._App = require( './schema/App' );
	//	Models
	$this.App = mongoose.model( 'App', $this._App );
	//////////////////////
	//	Public Methods //
	//////////////////////
	/**
	 * connect method
	 */
	$this.connect = function ( ) {
		var connectionString = $this.connectionString || 'mongodb://localhost/visfor';
		$this.common.mongoose.connect( connectionString );
	};
	//	return object instance
	return $this;
};
module.exports = Data;