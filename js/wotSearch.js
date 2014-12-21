/*
    WoT Search main object
*/
(function(){

    var wotSearch = function ($http, $log) { 

        var applicationId = "demo"; //"3f6379825637847c3c4c6c71b3530cdb";

        var urlPlayerInfo = "http://api.worldoftanks.eu/wot/account/info/?application_id=" + applicationId + "&account_id=",
              urlClanInfo = "http://api.worldoftanks.eu/wot/clan/info/?application_id=" + applicationId + "&clan_id="
              urlTankInfo = "http://api.worldoftanks.com/wot/encyclopedia/tankinfo/?application_id=" + applicationId + "&tank_id=";
        
        var searchPlayers = function(name) {
        	
        }
        var searchClans = function(name) {
        	
        }
        var getPlayerInfo = function(playerId) {
            $log.info("Getting player " + playerId + " information...");
            var player = null;
        	return $http.get(urlPlayerInfo + playerId)
                        .then(function(response) {
                            return response.data.data[playerId];
                         });
        }
        var getClanInfo = function(clanId) {
            $log.info("Getting clan " + clanId + " information...");
            return $http.get(urlClanInfo + clanId)
                        .then(function(response) {
                            return response.data.data[clanId];
                         });
        }
        var getTankInfo = function(tankId) {
            $log.info("Getting tank " + tankId + " information...");
            return $http.get(urlTankInfo + tankId)
                        .then(function(response) {
                            return response.data.data
                         });
        }

        return {
        	"findPlayers": searchPlayers,
        	"findClans": searchClans,
        	"getPlayer": getPlayerInfo,
        	"getClan": getClanInfo,
            "getTank": getTankInfo
        };
    };


    var app = angular.module("wotSearchApp");
    app.factory("wotSearch", wotSearch);

}());