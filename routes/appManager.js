var _ = require( 'lodash' ),
	//	modules
	$logger = require( '../lib/logger' )( module );
//	App Manager Routes
module.exports = {
	/**
	 * inserts current app manager and then returns handler to restart all apps
	 *
	 * @method
	 *
	 * @param  {Class} $appManager
	 *
	 * @return {Function}
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
	 * @param  {Class} $appManager
	 *
	 * @return {Function}
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
	 * @param  {Class} $appManager
	 *
	 * @return {Function}
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
	 * @param  {Class} $appManager
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
	},
	///////////////////
	//	App Methods //
	///////////////////
	/**
	 * inserts current app manager and then returns handler to start app
	 *
	 * @method
	 *
	 * @param  {Class} $appManager
	 *
	 * @return {Function}
	 */
	startApp: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * return the actual handler with app manager now in its name space
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {[type]}
		 */
		return function ( req, res ) {
			var appName = req.body.name;
			$this.$appManager.startApp( appName, function ( err, pid ) {
				if ( err ) res.json( {
					hasErr: true,
					error: err
				} );
				else res.json( {
					status: 'app started',
					pid: pid
				} );
			} );
		};
	},
	/**
	 * inserts current app manager and then returns handler to restart app
	 *
	 * @method
	 *
	 * @param  {Class} $appManager
	 *
	 * @return {Function}
	 */
	restartApp: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * return the actual handler with app manager now in its name space
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {[type]}
		 */
		return function ( req, res ) {
			var appName = req.body.name;
			$this.$appManager.restart( appName, function ( err, pid ) {
				if ( err ) res.json( {
					hasErr: true,
					error: err
				} );
				else res.json( {
					status: 'app started',
					pid: pid
				} );
			} );
		};
	},
	/**
	 * inserts current app manager and then returns handler to stop app
	 *
	 * @method
	 *
	 * @param  {Class} $appManager
	 *
	 * @return {Function}
	 */
	stopApp: function ( $appManager ) {
		var $this = this;
		$this.$appManager = $appManager;
		/**
		 * return the actual handler with app manager now in its name space
		 *
		 * @method
		 *
		 * @param  {Express.req} req
		 * @param  {Express.res} res
		 *
		 * @return {[type]}
		 */
		return function ( req, res ) {
			var appName = req.body.name;
			$this.$appManager.stopApp( appName, function ( err, pid ) {
				if ( err ) res.json( {
					hasErr: true,
					error: err
				} );
				else res.json( {
					status: 'app started',
					pid: pid
				} );
			} );
		};
	}
};