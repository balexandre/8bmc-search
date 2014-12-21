/*
    WoT Search: Clan information Controller
*/

(function() {
	
	var app = angular.module('wotSearchApp');

	var ClanInfoController = function($scope, $location, $routeParams, wotSearch) {

		// error
		var onError = function(reason) {
			$scope.error = "Could not fetch information";
			loading(false);
		};

		var onClanComplete = function(response) {
			console.log("onClanComplete");
			console.log(response);
			$scope.clan = response;

			if(response.status !== "ok") {
				$scope.clan.error = response.error;
			}
		};

		var getClanInformation = function(clanId) {
			wotSearch.getClan(clanId).then(onClanComplete, onError);
		};

		$scope.clan = null;

		getClanInformation($routeParams.clanid);
    };

    app.controller("ClanInfoController", [
    	"$scope", "$location", "$routeParams", "wotSearch", ClanInfoController]);

}());