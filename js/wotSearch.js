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

        var fieldsPlayerLang = ["client_language"];

        var searchPlayers = function(name) {
            var url = urlPlayerSearch + name;
            $log.info("Searching for players: " + name);
            $log.info(url);
            return $http.get(url)
                .then(function(response) {
                    return response.data;
                });
        };
        var searchClans = function(name) {
            var url = urlClanSearch + name;
            $log.info("Searching for clans: " + name);
            $log.info(url);
            return $http.get(url)
                .then(function(response) {
                    return response.data;
                });
        };
        var getPlayerInfo = function(playerId) {
            var url = urlPlayerInfo + playerId;
            $log.info("Getting player " + playerId + " information...");
            $log.info(url);
            var player = null;
        	return $http.get(url)
                        .then(function(response) {
                            return response.data;
                         });
        };
        var getPlayerLanguageInfo = function(playerId) {
            var url = urlPlayerInfo + playerId + getFields(fieldsPlayerLang);
            $log.info("Getting language info for player " + playerId + " information...");
            $log.info(url);
            var player = null;
            return $http.get(url)
                .then(function(response) {
                    return response.data;
                });
        };
        var getClanInfo = function(clanId) {
            var url = urlClanInfo + clanId;
            $log.info("Getting clan " + clanId + " information...");
            $log.info(url);
            return $http.get(url)
                        .then(function(response) {
                            return response.data;
                         });
        };
        var getTankInfo = function(tankId) {
            var url = urlTankInfo + tankId;
            $log.info("Getting tank " + tankId + " information...");
            $log.info(url);
            return $http.get(url)
                        .then(function(response) {
                            return response.data;
                         });
        };

        var getFields = function(fields) {
            return "&fields=" + fields.join();
        };

        return {
        	"findPlayers": searchPlayers,
        	"findClans": searchClans,
        	"getPlayer": getPlayerInfo,
        	"getClan": getClanInfo,
            "getTank": getTankInfo,
            "getPlayerLanguage": getPlayerLanguageInfo
        };
    };

    var app = angular.module("wotSearchApp");
    app.factory("wotSearch", wotSearch);

}());