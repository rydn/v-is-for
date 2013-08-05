'use strict';
angular.module('vIsForVirtualApp', ['ngResource'])
	.config(function($routeProvider ) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/settings', {
				templateUrl: 'views/settings.html',
				controller: 'SettingsCtrl'
			})
			.when('/apps/:_id/delete', {
				templateUrl: 'views/confirmDelete.html',
				controller: 'ConfirmDeleteCtrl'
			})

			.otherwise({
				redirectTo: '/'
			});
	});
