'use strict';
angular.module( 'vIsForVirtualApp' )
	.controller( 'MainCtrl', function ( $scope, $rootScope, $resource, $http ) {
		///////////////////
		//	SETUP VIEW //
		///////////////////
		//  resource providers
		var Apps = $resource( '/api/v1/apps/:id', {
			id: '@_id'
		} );
		//	setup tabs
		$( '#sideTabs a' ).click( function ( e ) {
			e.preventDefault( );
			$( this ).tab( 'show' );
		} );
		//	get apps
		var getApps = function ( ) {
			$http.get( '/api/v1/apps' )
				.success( function ( apps ) {
					//	get statuses
					$http.get( '/api/v1/appmanager/status' )
						.success( function ( statuses ) {
							$rootScope.statuses = statuses;
							var completeApps = [ ];
							for ( var i = apps.length - 1; i >= 0; i-- ) {
								var app = apps[ i ];
								console.log( app );
								app.status = statuses[ i ].status;
								app.pid = statuses[ i ].pid;
								completeApps.push( app );
							}
							$rootScope.apps = completeApps;
						} );
				} );
		};
		//	make call for status
		var getProxyStatus = function ( ) {
			$http.get( '/api/v1/proxy/status' )
				.success( function ( proxyStatus ) {
					if ( proxyStatus.status ) {
						$rootScope.proxyStatus = proxyStatus.status;
						if ( proxyStatus.status == 'running' ) {
							$rootScope.proxyOkay = true;
						} else {
							$rootScope.proxyOkay = false;
						}
					}
				} );
		};
		var getHits = function ( ) {
			$http.get( '/api/v1/proxy/hits' )
				.success( function ( proxyHits ) {
					if ( proxyHits ) {
						$rootScope.stats = proxyHits;
						$rootScope.proxyMetrics = proxyHits[ 'metrics' ];
						delete $rootScope.stats.metrics;
					}
				} );
		};
		var getPingStatus = function ( ) {
			$http.get( '/api/v1/pings/status' )
				.success( function ( pingStatus ) {
					if ( pingStatus ) {
						$rootScope.pingStatus = pingStatus;
					}
				} )
		}
		var doFullRefresh = function ( hideAlert ) {
			if ( !hideAlert ) {
				$.bootstrapGrowl( 'refreshing...', {
					delay: 500
				} );
			}
			getApps( );
			getProxyStatus( );
			getHits( );
			getPingStatus( );
		};
		///////////////////
		//	initialize //
		///////////////////
		doFullRefresh( );
		//	set to do a refresh every 20 seconds and hide the alert saying so
		var every = FluentTime.every;
		every( 15 ).seconds( function ( ) {
			doFullRefresh( true );
		} );
		//////////////////////
		//	SCOPE METHODS //
		//////////////////////
		//	save method
		$scope.save = function ( ) {
			$( '#save' )
				.text( 'working' )
				.attr( 'disabled', true );
			//	create new model instance
			var newHost = new Apps( {
				name: $scope.inputAppName,
				domain: $scope.inputDomain,
				target: $scope.inputTarget,
				processType: $scope.inputRuntime,
				entryPoint: $scope.inputEntry,
				rootPath: $scope.inputPath
			} );
			//	clear controls
			$scope.inputTarget = null;
			$scope.inputDomain = null;
			$scope.inputAppName = null;
			$.bootstrapGrowl( 'Adding new app...' );
			//	save to db
			newHost.$save( function ( result ) {
				if ( result ) {
					getApps( );
					$rootScope.alertTitle = 'Huraahhh!';
					$rootScope.alertBody = 'your new app added!';
					$( '#save' )
						.text( 'Create' )
						.removeAttr( 'disabled' );
					$.bootstrapGrowl( 'Added new app.' );
				} else {
					$.bootstrapGrowl( 'An error occured, please try again' );
				}
			} );
		};
		//	delete method
		$scope.delete = function ( _id ) {
			var that = Apps.delete( {
				_id: _id
			} );
			//	update view
			getApps( );
			$.bootstrapGrowl( 'App deleted.' );
		};
		//	update
		$scope.updateApp = function ( attr, value, _id ) {
			$.bootstrapGrowl( 'Updating app...' );
			$http.post( '/api/v1/apps/' + _id, {
				param: attr,
				value: value
			} )
				.success( function ( response ) {
					//	update view
					getApps( );
					$.bootstrapGrowl( 'Updated app.' );
				} );
		};
		//////////////////////////////////
		//	server action controllers //
		//////////////////////////////////
		$scope.startAll = function ( ) {
			$.bootstrapGrowl( 'Starting all apps...' );
			$http.post( '/api/v1/appmanager/startall' )
				.success( function ( response ) {
					setTimeout( function ( ) {
						$.bootstrapGrowl( 'Apps started.' );
						getApps( );
					}, 500 );
				} );
		};
		$scope.stopAll = function ( ) {
			$.bootstrapGrowl( 'Stopping all apps...' );
			$http.post( '/api/v1/appmanager/stopall' )
				.success( function ( response ) {
					setTimeout( function ( ) {
						$.bootstrapGrowl( 'All apps stopped.' );
						getApps( );
					}, 500 );
				} );
		};
		$scope.restartAll = function ( ) {
			$.bootstrapGrowl( 'Restarting all apps...' );
			$http.post( '/api/v1/appmanager/restartall' )
				.success( function ( response ) {
					setTimeout( function ( ) {
						$.bootstrapGrowl( 'All apps restarted.' );
						getApps( );
					}, 500 );
				} );
		};
		/////////////////////////////////
		//	proxy action controllers //
		/////////////////////////////////
		$scope.proxyStart = function ( ) {
			$.bootstrapGrowl( 'Starting Proxy...' );
			$http.post( '/api/v1/proxy/start' )
				.success( function ( response ) {
					setTimeout( function ( ) {
						$.bootstrapGrowl( 'Proxy running.' );
						getProxyStatus( );
					}, 500 );
				} );
		};
		$scope.proxyStop = function ( ) {
			$.bootstrapGrowl( 'Stopping proxy...' );
			$http.post( '/api/v1/proxy/stop' )
				.success( function ( response ) {
					setTimeout( function ( ) {
						$.bootstrapGrowl( 'Proxy stopped.' );
						getProxyStatus( );
					}, 500 );
				} );
		};
		$scope.proxyRestart = function ( ) {
			$.bootstrapGrowl( 'Restarting proxy...' );
			$http.post( '/api/v1/proxy/restart' )
				.success( function ( response ) {
					setTimeout( function ( ) {
						$.bootstrapGrowl( 'Proxy running.' );
						getProxyStatus( );
					}, 500 );
				} );
		};
		///////////////////////////////
		//	app action controllers //
		///////////////////////////////
		$scope.appStart = function ( $event ) {
			var appName = $( $event.currentTarget ).data( ).appname;
			//	check if button is enabled
			if ( !$( $event.currentTarget ).hasClass( "disabled" ) ) {
				$.bootstrapGrowl( 'starting ' + appName + '...' );
				$http.post( '/api/v1/appmanager/startapp', {
					name: appName
				} ).success( function ( response ) {
					if ( !response.hasErr ) {
						$.bootstrapGrowl( appName + ' restarted! new pid: ' + response.pid );
						doFullRefresh( true );
					} else {
						$.bootstrapGrowl( 'woops something went wrong when tying to restart your app, try again maybe?' );
						doFullRefresh( true );
					}
				} );
			};
		};
		$scope.appStop = function ( $event ) {
			var appName = $( $event.currentTarget ).data( ).appname;
			//	check if button is enabled
			if ( !$( $event.currentTarget ).hasClass( "disabled" ) ) {
				$.bootstrapGrowl( 'stopping ' + appName + '...' );
				$http.post( '/api/v1/appmanager/stopapp', {
					name: appName
				} ).success( function ( response ) {
					if ( !response.hasErr ) {
						$.bootstrapGrowl( appName + ' stopped!' );
						doFullRefresh( true );
					} else {
						$.bootstrapGrowl( 'woops something went wrong when tying to restart your app, try again maybe?' );
						doFullRefresh( true );
					}
				} );
			}
		};
		$scope.appRestart = function ( $event ) {
			var appName = $( $event.currentTarget ).data( ).appname;
			$.bootstrapGrowl( 'starting ' + appName + '...' );
			$http.post( '/api/v1/appmanager/restartapp', {
				name: appName
			} ).success( function ( response ) {
				if ( !response.hasErr ) {
					$.bootstrapGrowl( appName + ' restarted! new pid: ' + response.pid );
					doFullRefresh( true );
				} else {
					$.bootstrapGrowl( 'woops something went wrong when tying to restart your app, try again maybe?' );
					doFullRefresh( true );
				}
			} );
		}
	} );