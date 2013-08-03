'use strict';
angular.module( 'vIsForVirtualApp' )
	.controller( 'ConfirmDeleteCtrl', function ( $scope, $rootScope, $resource, $routeParams ) {
		//  resource providers
		var Apps = $resource( '/api/v1/apps/:id', {
			id: '@_id'
		} );
		
			console.log(Apps);
		$scope.app = Apps.query({_id:$routeParams._id});

		//	delete method
		$scope.delete = function ( _id ) {
			console.log(_id);
			var that = Apps.$remove( {
				_id: _id
			} );
			console.log( that );
			//	update view
			$scope.apps = Apps.query( );
		};
	} );