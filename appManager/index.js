var path = require('path'),
	_ = require('lodash'),
	$DB = require('../data/'),
	$logger = require('../lib/logger');
//apacheTail.start( );
module.exports = function(options ) {
	//	init
	var $this = this;
	$this.options = options || {};
	$this.apps = [];
	$this.processes = [];
	$this.db = new $DB();
	/**
	 * load configuration from db initiate objects
	 *
	 * @method
	 *
	 */
	$this.loadConfigurations = function(callback ) {
		$this.db.App.find(function(err, apps ) {
			if (err) $logger.error(err);
			else {
				//	iterate each app adding a runner
				_.each(apps, function(app ) {
					//	construct new app object and push to cache
					var _app = $this.newApp(app);
					$this.apps.push(_app);
					var processRunner = require('./child')({
						command: _app.process,
						args: [path.resolve(_app.rootPath + '/' + _app.script)],
						options: [],
						autoRestart: _app.restart,
						restartTimeout: 2500,
						// Callback when the process is Auto-restarted
						cbRestart: function(data ) {
							$logger.info('restarting "' + app.name + '"');
						},
						// //  On Output
						// cbStdout: function ( data ) {
						// 	$logger.log( data.toString( ) );
						// },
						//  On Error
						cbStderr: function(data ) {
							$logger.error(data.toString());
						},
						//  On Exit
						cbClose: function(exitCode ) {
							$logger.warn('"' + app.name + '"" existed, exitcode: ' + exitCode);
						}
					});
					//	add to cache
					$this.processes[app.name] = processRunner;
					$logger.debug('"' + app.name + '" configuration added to appManager');
				});
				callback(null, $this.processes);
			}
		});
	};
	/**
	 * returns app object
	 *
	 * @method
	 *
	 * @param  {Object} appDet
	 *
	 * @return {AppO}
	 */
	$this.newApp = function(appDet ) {
		if (appDet) {
			return {
				appName: appDet.name,
				process: '/usr/local/bin/node',
				script: appDet.entryPoint,
				rootPath: appDet.rootPath,
				restart: true
			};
		}
	};
	/**
	 * start all configured apps
	 *
	 * @method
	 *
	 * @return {Function}
	 */
	$this.startAll = function() {
		$logger.debug('starting managed apps...');
		_.each($this.apps, function(app ) {
			$logger.debug('"' + app.appName + '" starting...');
			//	start app by name
			if ($this.processes[app.appName].status !== 'running') {
				$this.processes[app.appName].start(function(procPID ) {
					$this.processes[app.appName].status = 'running';
					$this.processes[app.appName].pid = procPID;
					$this.processes[app.appName].name = app.appName;
					$logger.info('"' + app.appName + '" started, pid: ' + procPID);
				});
			}
		});
	};
	/**
	 * stop all configured apps
	 *
	 * @method
	 *
	 * @return {Function}
	 */
	$this.stopAll = function(callback ) {
		$logger.debug('stopping managed apps...');
		_.each($this.apps, function(app ) {
			//	stop app by name
			$this.processes[app.appName].stop();
			$this.processes[app.appName].status = 'stopped';
			$this.processes[app.appName].pid = null;
			$logger.info('"' + app.appName + '" stopping...');
		});
		if (callback) {
			setTimeout(function() {
				callback();
			}, 1000);
		}
	};
	/**
	 * restart all configured apps
	 *
	 * @method
	 *
	 * @return {Function}
	 */
	$this.restartAll = function() {
		$logger.info('Restarting managed apps');
		$this.stopAll();
		_.each($this.apps, function(app ) {
			setTimeout(function() {
				if ($this.processes[app.appName].status !== 'running') {
					$logger.info('"' + app.appName + '" restarting...');
					//	start app by name
					$this.processes[app.appName].start(function(procPID ) {
						$this.processes[app.appName].status = 'running';
						$this.processes[app.appName].pid = procPID;
						$this.processes[app.appName].name = app.appName;
						$logger.info('"' + app.appName + '" started, pid: ' + procPID);
					});
				} else {
					$logger.info('"' + app.appName + '" already running');
				}
			}, 500);
		});
	};
	/**
	 * start specific app
	 *
	 * @method
	 *
	 * @param  {String} appName
	 *
	 * @return {Object}
	 */
	$this.startApp = function(appName ) {
		if (appName) {
			var handler = $this.processes[appName];
			if (handler) {
				if (handler.status !== 'running') {
					$logger.info('"' + appName + '" starting...');
					handler.start(function(procPID ) {
						handler.status = 'running';
						handler.pid = procPID;
						$logger.info('"' + app.appName + '" started, pid: ' + procPID);
					});
				} else {
					$logger.info('"' + app.appName + '" already running');
				}
			}
		}
	};
	/**
	 * stop specific app
	 *
	 * @method
	 *
	 * @param  {String} appName
	 *
	 * @return {Object}
	 */
	$this.stopApp = function(appName ) {
		if (appName) {
			var handler = $this.processes[appName];
			if (handler) {
				handler.stop();
				handler.status = 'stopped';
				handler.pid = null;
				$logger.info('"' + appName + '" stopping...');
			}
		}
	};
	/**
	 * restart specific app
	 *
	 * @method
	 *
	 * @param  {String} appName
	 *
	 * @return {Object}
	 */
	$this.restartApp = function(appName ) {
		if (appName) {
			var handler = $this.processes[appName];
			if (handler) {
				handler.restart();
				$logger.info('"' + appName + '" restarting...');
			}
		}
	};
};
