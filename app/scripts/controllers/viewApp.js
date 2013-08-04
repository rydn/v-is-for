'use strict';
angular.module( 'vIsForVirtualApp' ).controller( 'ViewappCtrl', function ( $scope, $resource, $http, $location, $routeParams ) {
	//  resource providers
	var Apps = $resource( '/api/v1/apps/:id', {
		id: '@_id'
	} );
	//	get proxy config
	//	get app to delete
	var app = Apps.query( {
		id: $routeParams._id
	}, function ( ) {
		$scope.app = app[ 0 ];
	} );
} );