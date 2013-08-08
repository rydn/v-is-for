angular.module( 'vIsForVirtualApp' )
	.controller( 'PingsCtrl', function ( $scope, $rootScope, $http, $routeParams ) {
		////////////////////////
		//	scope properties //
		////////////////////////
		$scope.pings = null;
		$scope.nextPingsUrl = null;
		$scope.prevPingsUrl = null;
		$scope.skipDigit = null;
		$scope.nextDigit = null;
		$scope.selectedUrl = $routeParams.url;
		////////////////////////
		//	scope methods    //
		////////////////////////
		/**
		 * handles response from data endpoint and updates scope properties
		 *
		 * @method
		 *
		 * @param  {Object} pings
		 *
		 */
		$scope.handle = function ( pings ) {
			//	update properties
			$scope.pings = pings.data;
			$scope.nextPingsUrl = pings.next;
			$scope.prevPingsUrl = pings.prev;
			$scope.skipDigit = pings.prev.indexOf( 'skip=' ) > 0 ? true : false;
			$scope.nextDigit = pings.data.length == 15 ? true : false;
		};
		/**
		 * retrieve initial data set
		 *
		 * @method
		 *
		 */
		$scope.init = function ( ) {
			//	get data for view
			$http.get( '/api/v1/pings/bysite/' + $scope.selectedUrl )
				.success( $scope.handle );
		};
		/**
		 * retrieve previous data set
		 *
		 * @method
		 *
		 */
		$scope.prevPings = function ( ) {
			$http.get( $scope.prevPingsUrl )
				.success( $scope.handle );
		};
		/**
		 * retrieve next data set
		 *
		 * @method
		 *
		 */
		$scope.nextPings = function ( ) {
			$http.get( $scope.nextPingsUrl )
				.success( $scope.handle );
		};
		/**
		 * render chart
		 *
		 * @method
		 *
		 */
		$scope.renderChart = function ( ) {
			$.bootstrapGrowl( 'getting chart data...' );
			d3.json( '/api/v1/pings/chartquery/' + $scope.selectedUrl, function ( data ) {
				nv.addGraph( function ( ) {
					var chart = nv.models.scatterChart( )
						.x( function ( d ) {
							return Number( d[ 0 ] );
						} )
						.y( function ( d ) {
							return Number( d[ 1 ] );
						} ) //adjusting, 100% is 1.00, not 100 as it is in the data
					.color( d3.scale.category10( )
						.range( ) )
						.clipVoronoi( true );
					chart.xAxis
						.tickFormat( function ( d ) {
							return d3.time.format( '%c' )( new Date( d ) );
						} )
						.axisLabel( 'Date' );
					chart.yAxis.tickFormat( d3.format( '.2d' ) )
						.axisLabel( 'Response Time' );
					d3.select( '#chart svg' )
						.datum( data )
						.transition( )
						.duration( 500 )
						.call( chart );
					nv.utils.windowResize( chart.update );
					return chart;
				} );

			} );
		};
		//////////////
		//	on run //
		//////////////
		$scope.init( );
		$scope.renderChart( );
	} );
