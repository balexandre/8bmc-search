/*
    WoT Search: Main Controller
*/

(function() {
	
	var app = angular.module('wotSearchApp');

	var MainController = function($scope, $location) {

		$scope.sClans = function(searchExpression) {
			$location.path("/clans/" + searchExpression);
		};

		$scope.sPlayers = function(searchExpression) {
			$location.path("/players/" + searchExpression);
		};

		$scope.year = (new Date()).getFullYear(); // footer year
		
    };

    app.controller("MainController", ["$scope", "$location", MainController]);

}());