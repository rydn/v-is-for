'use strict';
angular.module('vIsForVirtualApp')
	.controller('SettingsCtrl', function($scope, $rootScope, $resource ) {
		//	resources
		var Config = $resource('/api/configs/:id', {
			id: '@_id'
		}, {});
		//	save method
		$scope.save = function() {
			var newConfig = new Config({
				name: $scope.inputName,
				port: $scope.inputPort,
				failsToDown: $scope.inputFailsToDown,
				maxRetries: $scope.inputMaxRetries,
				targetRetryDelay: $scope.inputTargetRetryDelay,
				message404: $scope.inputMessage404,
				message503: $scope.inputMessage503,
				logLevel: $scope.inputLogLevel,
				logFile: $scope.inputLogFile
			});
			newConfig.$save(function(savedObject, responseHeaders ) {
				console.log(savedObject, responseHeaders);
				//	show alert
				$rootScope.alertTitle = 'Huraaah!';
				$rootScope.alertBody = 'Config Saved!';
			});

			return this;
		};
	});
