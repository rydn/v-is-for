angular.module( 'vIsForVirtualApp' )
	.controller( 'ConfirmDeleteCtrl', function ( $scope, $resource, $routeParams, $location ) {
		//  resource providers
		var Apps = $resource( '/api/v1/apps/:id', {
			id: '@_id'
		} );
		//	get app to delete
		var app = Apps.query( {
			id: $routeParams._id
		}, function ( ) {
			$scope.app = app[ 0 ];
		} );
		//	delete method
		$scope.deleteApp = function ( ) {
			var that = Apps.delete( {
				id: $scope.app._id
			} );
			$location.path( '/' );
		};
	} );