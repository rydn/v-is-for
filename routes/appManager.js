var _ = require( 'lodash' ),
	//	modules
	$logger = require( '../lib/logger' );
//	App Manager Routes
module.exports = {
	/**
	 * inserts current app manager and then returns handler to restart all apps
	 *
	 * @method
	 *
	 * @param  {[type]} $appManager
	 *
	 * @return {[type]}
	 */
	restartAll: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * return handler for request
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {Function}
		 */
		return function ( req, res ) {
			$this.$appManager.restartAll( );
			res.json( {
				result: 'processes restarting'
			} );
		};
	},
	/**
	 * inserts current app manager and then returns handler to stop all apps
	 *
	 * @method
	 *
	 * @param  {[type]} $appManager
	 *
	 * @return {[type]}
	 */
	stopAll: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * return handler for request
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {Function}
		 */
		return function ( req, res ) {
			$this.$appManager.stopAll( );
			res.json( {
				result: 'processes stopping'
			} );
		};
	},
	/**
	 * inserts current app manager and then returns handler to stop all apps
	 *
	 * @method
	 *
	 * @param  {[type]} $appManager
	 *
	 * @return {[type]}
	 */
	startAll: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * return handler for request
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {Function}
		 */
		return function ( req, res ) {
			$this.$appManager.startAll( );
			res.json( {
				result: 'processes starting'
			} );
		};
	},
	/**
	 * inserts current app manager and then returns handler to get status of all apps
	 *
	 * @method
	 *
	 * @param  {Object} $appManager
	 *
	 * @return {Function}
	 */
	status: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * returns handler for request
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {Function}
		 */
		return function ( req, res ) {
			var statuses = [ ];
			_.each( $this.$appManager.apps, function ( app ) {
				var proc = $this.$appManager.processes[ app.appName ];
				statuses.push( proc );
			} );
			res.json( statuses );
		};
	}
};