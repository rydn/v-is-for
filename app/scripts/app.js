'use strict';
angular.module( 'vIsForVirtualApp', [ 'ngResource' ] )
	.config( function ( $routeProvider ) {
		$routeProvider
			.when( '/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			} )
			.when( '/apps/:_id/delete', {
				templateUrl: 'views/confirmDelete.html',
				controller: 'ConfirmDeleteCtrl'
			} )
			.when('/pings/:url', {
				templateUrl: 'views/pings.html',
				controller:'PingsCtrl'
			})
			.otherwise( {
				redirectTo: '/'
			} );
	} );