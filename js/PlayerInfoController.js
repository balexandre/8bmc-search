/*
    WoT Search: Players Controller
*/

(function() {

	var app = angular.module('wotSearchApp');

	var PlayerInfoController = function ($scope, $log, $routeParams, wotSearch) {

		var nickname = $routeParams.nickname,
			accountId = $routeParams.accountid,
			urlTpl = "#/player/" + nickname + "/:" + accountId + "/info";

		var onError = function (reason) {
			$log.error(reason);
			$scope.error = reason;
		};
		var onClanComplete = function (response) {
			$log.info("clan data");
			$log.info(response);
			$scope.clan = response.data[Object.keys(response.data)[0]];;
		};
		var onTankComplete = function (response) {
			$log.info("tank data");
			$log.info(response);
			$scope.tanks = response.data;
			$scope.tanks.max_xp_tank = $scope.tanks[$scope.player.statistics.max_xp_tank_id];
			$scope.tanks.max_frags_tank = $scope.tanks[$scope.player.statistics.max_frags_tank_id];
			$scope.tanks.max_damage_tank = $scope.tanks[$scope.player.statistics.max_damage_tank_id];

			// bootstrap calls
			$('.pop').popover();
			$("a[title]").tooltip();
		};
		var onPlayerComplete = function (response) {
			$log.info("player data");
			$log.info(response);
			$scope.player = response.data[Object.keys(response.data)[0]];

			if ($scope.player.clan_id) {
				// player has a clan, let's get the information
				wotSearch.getClan($scope.player.clan_id).then(onClanComplete, onError);
			}

			// get tanks information for max_damage, max_frags and max_xp
			var tanks = [];
			if ($scope.player.statistics.max_damage_tank_id)
				tanks.push($scope.player.statistics.max_damage_tank_id);
			if ($scope.player.statistics.max_frags_tank_id)
				tanks.push($scope.player.statistics.max_frags_tank_id);
			if ($scope.player.statistics.max_xp_tank_id)
				tanks.push($scope.player.statistics.max_xp_tank_id);

			if (tanks.length > 0) {
				wotSearch.getTank(tanks.join()).then(onTankComplete, onError);
			}
		};

		var getPlayerInformation = function (accountId) {
			wotSearch.getPlayer(accountId).then(onPlayerComplete, onError);
		};

		$scope.player = null;
		$scope.clan = null;

		getPlayerInformation(accountId);
	};

    app.controller("PlayerInfoController", [
    	"$scope", "$log", "$routeParams", "wotSearch",
    	PlayerInfoController]);

}()); 