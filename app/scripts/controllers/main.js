'use strict';
angular.module( 'vIsForVirtualApp' )
	.controller( 'MainCtrl', function ( $scope, $rootScope, $resource ) {
		//  resource providers
		var Apps = $resource( '/api/v1/apps/:id', {
			id: '@_id'
		} );
		//	get apps
		$scope.apps = Apps.query( );
		//	save method
		$scope.save = function ( ) {
			$( '#save' ).text( 'working' ).attr( 'disabled', true );
			//	create new model instance
			var newHost = new Apps( {
				name: $scope.inputAppName,
				domain: $scope.inputDomain,
				target: $scope.inputTarget
			} );
			//	clear controls
			$scope.inputTarget = null;
			$scope.inputDomain = null;
			$scope.inputAppName = null;
			//	save to db
			newHost.$save( function ( result ) {
				if ( result ) {
					$scope.apps = Apps.query( );
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
			console.log(_id);
			var that = Apps.delete( {
				_id: _id
			} );
			console.log( that );
			//	update view
			$scope.apps = Apps.query( );
		};
	} );