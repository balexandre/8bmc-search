/*
    WoT Search main object
*/
(function(){

    /*
        API Calls
        http://eu.wargaming.net/developers/api_explorer/wot/account/list/?application_id=demo&http_method=GET
        Documentation
        http://eu.wargaming.net/developers/api_reference/wot/account/list/
     */

    var wotSearch = function ($http, $log) { 

        var applicationId = "demo"; //"3f6379825637847c3c4c6c71b3530cdb";

        var urlPlayerInfo = "http://api.worldoftanks.eu/wot/account/info/?application_id=" + applicationId + "&account_id=",
              urlClanInfo = "http://api.worldoftanks.eu/wot/clan/info/?application_id=" + applicationId + "&clan_id=",
              urlTankInfo = "http://api.worldoftanks.com/wot/encyclopedia/tankinfo/?application_id=" + applicationId + "&tank_id=";

        var urlClanSearch = "http://api.worldoftanks.eu/wot/clan/list/?application_id=" + applicationId + "&search=",
          urlPlayerSearch = "http://api.worldoftanks.eu/wot/account/list/?application_id=" + applicationId + "&search=";

        var searchPlayers = function(name) {
            $log.info("Searching for players: " + name);
            $log.info(urlPlayerSearch + name);
            return $http.get(urlPlayerSearch + name)
                .then(function(response) {
                    return response.data;
                });
        };
        var searchClans = function(name) {
            $log.info("Searching for clans: " + name);
            return $http.get(urlClanSearch + name)
                .then(function(response) {
                    return response.data;
                });
        };
        var getPlayerInfo = function(playerId) {
            $log.info("Getting player " + playerId + " information...");
            $log.info(urlPlayerInfo + playerId);
            var player = null;
        	return $http.get(urlPlayerInfo + playerId)
                        .then(function(response) {
                            return response.data;
                         });
        };
        var getClanInfo = function(clanId) {
            $log.info("Getting clan " + clanId + " information...");
            $log.info(urlClanInfo + clanId);
            return $http.get(urlClanInfo + clanId)
                        .then(function(response) {
                            return response.data;
                         });
        };
        var getTankInfo = function(tankId) {
            $log.info("Getting tank " + tankId + " information...");
            $log.info(urlTankInfo + tankId);
            return $http.get(urlTankInfo + tankId)
                        .then(function(response) {
                            return response.data;
                         });
        };

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