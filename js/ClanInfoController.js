/*
    WoT Search: Clan information Controller
*/

(function () {

    var app = angular.module('wotSearchApp');

    var ClanInfoController = function ($scope, $log, $routeParams, wotSearch) {

        // error
        var onError = function (reason) {
            $log.error(reason);
            $scope.error = "Could not fetch information";
        };

        var onPlayerLanguageComplete = function (response) {
            $log.info("onPlayerLanguageComplete");
            $log.info(response);

            if (response.status === "ok") {
                $scope.extraInfo = response.data;

                // append to clan
                for (i = 0; i < Object.keys($scope.extraInfo).length; i++) {
                    var playerId = Object.keys($scope.extraInfo)[i],
                        playerInfo = $scope.extraInfo[playerId];
                    
                    $scope.clan.members[playerId].client_language = playerInfo.client_language;
                    $scope.clan.members[playerId].logout_at = playerInfo.logout_at;
                }
            } else {
                $log.error(response.error);
                $scope.error = response.error;
            }

            // bootstrap calls
            setTimeout(function () { $('[data-toggle="tooltip"]').tooltip(); }, 1000);
        };

        var onClanComplete = function (response) {
            $log.info("onClanComplete");
            $log.info(response);
            $scope.clan = response.data[Object.keys(response.data)[0]];

            // let's get more info for each returned player
            var playerIds = [];
            for (var i = 0; i < Object.keys($scope.clan.members).length; i++) {
                var playerId = Object.keys($scope.clan.members)[i];
                playerIds.push(playerId);
            }
            wotSearch.getPlayerLanguage(playerIds.join()).then(onPlayerLanguageComplete, onError);

            // bootstrap calls
            setTimeout(function () { $('.pop').popover(); $("a[title]").tooltip(); }, 1000);
        };

        var getClanInformation = function (clanId) {
            wotSearch.getClan(clanId).then(onClanComplete, onError);
        };

        $scope.clan = null;
        $scope.predicate = 'created_at';
        $scope.reverse = true;

        var clanId = $routeParams.clanid;
        getClanInformation(clanId);
    };

    app.controller("ClanInfoController", [
    	"$scope", "$log", "$routeParams", "wotSearch", ClanInfoController]);

} ());