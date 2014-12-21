/*
    WoT Search: Players Controller
*/

(function() {
	// http://eu.wargaming.net/developers/api_explorer/wot/account/info/?application_id=demo&account_id=501164685,515094889&http_method=GET&run=1
    
	var app = angular.module('wotSearchApp');

	var PlayerInfoController = function($scope, $location, $routeParams, wotSearch) {

		var nickname = $routeParams.nickname,
		   accountid = $routeParams.accountid,
		      urlTpl = "#/player/" + nickname + "/:" + accountid + "/info";

		var onError = function(reason) {
			$scope.error = reason;
		};
		var onPlayerComplete = function(data) {
			console.log("player data");
			console.log(data);
			$scope.player = data;

			if(data.clan_id) {
				// player has a clan, let's get the information
				wotSearch.getClan(data.clan_id).then(onClanComplete, onError);
			}

			var tanks = [];
			if($scope.player.statistics.max_damage_tank_id) 
				tanks.push($scope.player.statistics.max_damage_tank_id);
			if($scope.player.statistics.max_frags_tank_id) 
				tanks.push($scope.player.statistics.max_frags_tank_id);
			if($scope.player.statistics.max_xp_tank_id) 
				tanks.push($scope.player.statistics.max_xp_tank_id);

			if(tanks.length > 0) {
				console.log("tanks data");
				console.log(tanks.join());
				wotSearch.getTank(tanks.join()).then(onTankComplete, onError);	
			}
		};
		var onClanComplete = function(data) {
			console.log("clan data");
			console.log(data);
			$scope.clan = data;
		};
		var onTankComplete = function(data) {
			console.log("tank data");
			console.log(data);
			$scope.tanks = data;
			$scope.tanks.max_xp_tank = data[$scope.player.statistics.max_xp_tank_id];
			$scope.tanks.max_frags_tank = data[$scope.player.statistics.max_frags_tank_id];
			$scope.tanks.max_damage_tank = data[$scope.player.statistics.max_damage_tank_id];

			$('.pop').popover();
			$(".tooltip").tooltip();
		};

		var getPlayerInformation = function(accountid) {
			wotSearch.getPlayer(accountid).then(onPlayerComplete, onError);
		};

		$scope.player = null;
		$scope.clan = null;
		
		getPlayerInformation(accountid);
    };

    app.controller("PlayerInfoController", [
    	"$scope", "$location", "$routeParams", "wotSearch", 
    	PlayerInfoController]);

}()); 