angular.module( 'vIsForVirtualApp' ).controller( 'PingsCtrl', function ( $scope, $rootScope, $http, $routeParams ) {
	$scope.selectedUrl = $routeParams.url;
	//	get data for view
	$http.get( '/api/v1/pings/bysite/' + $scope.selectedUrl ).success( function ( pings ) {
		//	properties
		$scope.pings = pings.data;
		$scope.nextPingsUrl = pings.next;
		$scope.prevPingsUrl = pings.prev;
		$scope.skipDigit = pings.prev.indexOf('skip=') >0 ? true:false;
		
		console.log(pings.prev.indexOf('skip=') >0 ? true:false);
		//	methods
		$scope.prevPings = function ( ) {
			$http.get( $scope.prevPingsUrl ).success( function ( pings ) {
				//	update properties
				$scope.pings = pings.data;
				$scope.nextPingsUrl = pings.next;
				$scope.prevPingsUrl = pings.prev;
				$scope.skipDigit = pings.prev.indexOf('skip=') >0 ? true:false;
				$scope.skipDigit = pings.prev.indexOf('skip=') >0 ? true:false;
			} );
		};
		$scope.nextPings = function ( ) {
			$http.get( $scope.nextPingsUrl ).success( function ( pings ) {
				//	update properties
				$scope.pings = pings.data;
				$scope.nextPingsUrl = pings.next;
				$scope.prevPingsUrl = pings.prev;
				$scope.skipDigit = pings.prev.indexOf('skip=') >0 ? true:false;
				$scope.skipDigit = pings.prev.indexOf('skip=') >0 ? true:false;
			} );
		};
	} );
} );