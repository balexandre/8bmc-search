/*
    WoT Search: Clan information Controller
*/

(function() {
	
	var app = angular.module('wotSearchApp');

	var ClanInfoController = function($scope, $log, $routeParams, wotSearch) {

		// error
		var onError = function(reason) {
			$log.error(reason);
			$scope.error = "Could not fetch information";
		};

		var onClanComplete = function(response) {
			$log.info("onClanComplete");
			$log.info(response);
			$scope.clan = response.data[Object.keys(response.data)[0]];
			
			// bootstrap calls
			$('.pop').popover();
			$("a[title]").tooltip();
		};

		var getClanInformation = function(clanId) {
			wotSearch.getClan(clanId).then(onClanComplete, onError);
		};

		$scope.clan = null;

		var clanId = $routeParams.clanid;
		getClanInformation(clanId);
    };

    app.controller("ClanInfoController", [
    	"$scope", "$log", "$routeParams", "wotSearch", ClanInfoController]);

}());