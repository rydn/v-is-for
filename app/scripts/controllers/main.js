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
			$http.get( '/api/v1/apps' ).success( function ( apps ) {
				//	get statuses
				$http.get( '/api/v1/appmanager/status' ).success( function ( statuses ) {
					$rootScope.statuses = statuses;
					var completeApps = [ ];
					for ( var i = apps.length - 1; i >= 0; i-- ) {
						var app = apps[ i ];
						console.log( app )
						app.status = statuses[ i ].status;
						app.pid = statuses[ i ].pid;
						completeApps.push( app );
					};
					$rootScope.apps = completeApps;
				} );
			} );
		};
		getApps( );
		//////////////////////
		//	SCOPE METHODS //
		//////////////////////
		//	save method
		$scope.save = function ( ) {
			$( '#save' ).text( 'working' ).attr( 'disabled', true );
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
			//	save to db
			newHost.$save( function ( result ) {
				if ( result ) {
					getApps( );
					$rootScope.alertTitle = 'Huraahhh!';
					$rootScope.alertBody = 'your new app added!';
					$( '#save' ).text( 'Create' ).removeAttr( 'disabled' );
					$( '.alert' ).alert( );
				} else {
					$rootScope.alertTitle = 'An error occured';
					$rootScope.alertBody = 'failed to create object in db';
					$( '.alert' ).alert( );
				}
			} )
		};
		//	delete method
		$scope.delete = function ( _id ) {
			var that = Apps.delete( {
				_id: _id
			} );
			console.log( that );
			//	update view
			getApps( );
		};
		//	update
		$scope.updateApp = function ( attr, value, _id ) {
			$http.post( '/api/v1/apps/' + _id, {
				param: attr,
				value: value
			} ).success( function ( response ) {
				//	update view
				getApps( );
			} );
		};
		//////////////////////////////////
		//	Global action controllers //
		//////////////////////////////////
		$rootScope.startAll = function ( ) {
			$http.post( '/api/v1/appmanager/startall' ).success( function ( response ) {
				getApps( );
			} );
		};
		$rootScope.stopAll = function ( ) {
			$http.post( '/api/v1/appmanager/stopall' ).success( function ( response ) {
				getApps( );
			} );
		};
		$rootScope.restartAll = function ( ) {
			$http.post( '/api/v1/appmanager/restartall' ).success( function ( response ) {
				getApps( );
			} );
		};
	} );