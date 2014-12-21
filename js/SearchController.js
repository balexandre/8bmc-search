/*
    WoT Search: Search Controller
*/

(function() {
    
	var app = angular.module('wotSearchApp');

	var SearchController = function($scope, $location, $http, $routeParams) {

		var loading = function(showLoading) {
			if(showLoading)
				$(".btn-search i").removeClass("fa-search").addClass("fa-circle-o-notch fa-spin");
			else
				$(".btn-search i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-search");
		};

		// error
		var onError = function(reason) {
			$scope.error = "Could not fetch information";
			loading(false);
		};

		// onClanComplete: when the clan info is fetched...
		var onClanSearchComplete = function(response) {
			console.log("onClanComplete");
			console.log(response);
			console.log(response.data);
			$scope.clans = response.data;

			if(response.data.status !== "ok") {
				$scope.clans.error = response.error;
			}
			loading(false);
		};
		// onSingleClanSearchComplete: when the single clan info is fetched...
		var onSingleClanSearchComplete = function(response) {
			console.log("onSingleClanSearchComplete");
			console.log(response);
			console.log(response.data);

			if(response.data.status !== "ok") {
				$scope.clans.error = response.error;
			}

				console.log("Object.keys(response.data.data).length");
				console.log(Object.keys(response.data.data).length);

			for(i=0; i<Object.keys(response.data.data).length; i++){
				var clanId = Object.keys(response.data.data)[i],
				  clanInfo = response.data.data[clanId],
				  playerId = $scope.playersAndClans[clanId];

				for(i=0; i<$scope.players.data.length; i++) {
					var pId = $scope.players.data[i].account_id;

					if(pId === playerId) {
						$scope.players.data[i].clanInfo = clanInfo; // attach clan info to user
						break;
					}
				}
			}

		};
		// onPlayerComplete: when the player info is fetched...
		var onPlayerSearchComplete = function(response) {
			console.log("onPlayerComplete");
			console.log(response);
			console.log(response.data);
			$scope.players = response.data;

			if(response.data.status !== "ok") {
				console.log("response.error");
				console.log(response.error);
				$scope.players.error = response.error;
			} else {
				// let's get more info for each returned player
				var playerIds = [];
				for(i=0; i<response.data.count; i++)
					playerIds.push(response.data.data[i].account_id);

				$http.get("http://api.worldoftanks.eu/wot/account/info/?application_id=demo&account_id=" + playerIds.join(','))
					 .then(onPlayerInfoComplete, onError);
			}
		};
		// onPlayerInfoComplete: attach the player details into the existing player info.
		var onPlayerInfoComplete = function(response) {
			console.log("onPlayerInfoComplete");
			console.log(response);
			console.log(response.data);
			$scope.playersInfo = response.data;

			for(i=0; i<$scope.players.data.length; i++) {
				var pId = $scope.players.data[i].account_id;
				var p = response.data.data[pId];
				if(p) {
					$scope.players.data[i].extraInfo = p;

					if(p.clan_id) {
						console.log("Player " + p.nickname + " (" + pId + ") has clan with id " + p.clan_id);
						// players has clan
						$scope.playersAndClans[p.clan_id] = pId; // hold player clan id
						$http.get("http://api.worldoftanks.eu/wot/clan/info/?application_id=demo&clan_id=" + p.clan_id) // clans
							 .then(onSingleClanSearchComplete, onError);
					}
				}
			}
			loading(false);
		};

		var searchForPlayers = function(searchExpression) {
			loading(true);
			$scope.clans = null;
			$http.get("http://api.worldoftanks.eu/wot/account/list/?application_id=demo&search=" + searchExpression) // players
				 .then(onPlayerSearchComplete, onError);
		};

		var searchForClans = function(searchExpression) {
			loading(true);
			$scope.players = null;
			$http.get("http://api.worldoftanks.eu/wot/clan/list/?application_id=demo&search=" + searchExpression) // clans
				 .then(onClanSearchComplete, onError);
		};

		$scope.Clans = function(searchExpression) {
			$location.path("/clans/" + searchExpression);
		};

		$scope.Players = function(searchExpression) {
			$location.path("/players/" + searchExpression);
		};

		$scope.playerSortOrder = "+extraInfo.global_rating";
		$scope.playersAndClans = {};

		if($routeParams.nickname) {
			searchForPlayers($routeParams.nickname);
		}
		else if($routeParams.clanname) {
			searchForClans($routeParams.clanname);
		}
    };

    app.controller("SearchController", ["$scope", "$location", "$http", "$routeParams", SearchController]);

}());