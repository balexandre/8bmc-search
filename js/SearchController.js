/*
    WoT Search: Search Controller
*/

(function() {
    
	var app = angular.module('wotSearchApp');

	var SearchController = function($scope, $location, $log, $routeParams, wotSearch) {

		var loading = function(showLoading) {
			if(showLoading)
				$(".btn-search i").removeClass("fa-search").addClass("fa-circle-o-notch fa-spin");
			else
				$(".btn-search i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-search");
		};

		// error
		var onError = function(reason) {
			$log.error(reason);
			$scope.error = "Could not fetch information";
			loading(false);
		};

		// onClanComplete: when the clan info is fetched...
		var onClanSearchComplete = function(response) {
			$log.info("onClanComplete");
			$log.info(response);
			$scope.clans = response;

			if(response.status !== "ok") {
				$scope.clans.error = response.error;
			}
			loading(false);
		};
		// onSingleClanSearchComplete: when the single clan info is fetched...
		var onPlayerClanSearchComplete = function(response) {
			$log.info("onPlayerClanSearchComplete");
			$log.info(response);

			if(response.status !== "ok") {
				$scope.clans.error = response.error;
			}

			for (var i = 0; i < Object.keys(response.data).length; i++) {
				var clanId = Object.keys(response.data)[i],
					clanInfo = response.data[clanId],
					playerId = $scope.playersAndClans[clanId];

				for (var b = 0; i < $scope.players.length; b++) {
					var pId = $scope.players[b].account_id;

					if (pId === playerId) {
						$scope.players[b].clanInfo = clanInfo; // attach clan info to user
						break;
					}
				}
			}

		};
		// onPlayerComplete: when the player info is fetched...
		var onPlayerSearchComplete = function(response) {
			$log.info("onPlayerComplete");
			$log.info(response);
			$scope.players = response.data;

			if(response.status !== "ok") {
				$scope.players.error = response.error;
			} else {
				// let's get more info for each returned player
				var playerIds = [];
				for (var i = 0; i < $scope.players.length; i++) {
					playerIds.push($scope.players[i].account_id);
				}
				wotSearch.getPlayer(playerIds.join(',')).then(onPlayerInfoComplete, onError);
			}
		};
		// onPlayerInfoComplete: attach the player details into the existing player info.
		var onPlayerInfoComplete = function(response) {
			$log.info("onPlayerInfoComplete");
			$log.info(response);
			$scope.playersInfo = response.data;

			var clans = [];
			for(var i=0; i<$scope.players.length; i++) {
				var pId = $scope.players[i].account_id;
				var p = $scope.playersInfo[pId];
				if(p) {
					$scope.players[i].extraInfo = p;

					if(p.clan_id) {
						$log.info("Player " + p.nickname + " (" + pId + ") has clan with id " + p.clan_id);
						$scope.playersAndClans[p.clan_id] = pId; // hold player clan id
						clans.push(p.clan_id);
					}
				}
			}

			if(clans.length > 0) {
				wotSearch.getClan(clans.join()).then(onPlayerClanSearchComplete, onError);
			}
			loading(false);
		};

		var searchForPlayers = function(nickname) {
			loading(true);
			$scope.clans = null;
			wotSearch.findPlayers(nickname).then(onPlayerSearchComplete, onError);
		};

		var searchForClans = function(clanName) {
			loading(true);
			$scope.players = null;
			wotSearch.findClans(clanName).then(onClanSearchComplete, onError);
		};

		$scope.Clans = function(clanName) {
			$location.path("/clans/" + clanName);
		};

		$scope.Players = function(nickname) {
			$location.path("/players/" + nickname);
		};

		$scope.playerSortOrder = "-extraInfo.global_rating";
		$scope.playersAndClans = {};

		// search
		if($routeParams.nickname) {
			searchForPlayers($routeParams.nickname);
		}
		else if($routeParams.clanname) {
			searchForClans($routeParams.clanname);
		}
    };

    app.controller("SearchController", [
		"$scope", "$location", "$log", "$routeParams", "wotSearch",
		SearchController]);

}());