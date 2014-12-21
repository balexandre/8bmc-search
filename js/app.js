/*
    WoT Search app initialization
*/

(function() {

	var app = angular.module("wotSearchApp", ["ngRoute"]);

    /* Config */
    app.config(function($routeProvider) {
    	$routeProvider
    		.when("/main", {
    			templateUrl: "partials/index.html",
    			controller: "MainController"
    		})
    		.when("/players/:nickname", {
    			templateUrl: "partials/searchPlayers.html",
    			controller: "SearchController"
    		})
            .when("/clans/:clanname", {
                templateUrl: "partials/searchClans.html",
                controller: "SearchController"
            })
    		.when("/player/:nickname/:accountid", {
    			templateUrl: "partials/playerInfo.html",
    			controller: "PlayerInfoController"
    		})
    		.when("/clan/:abbreviation/:clanid", {
    			templateUrl: "partials/clanInfo.html",
    			controller: "ClanInfoController"
    		})
    		.otherwise({
    			redirectTo:"/main"	
    		})
    });

    /* Filters */
    app
        .filter('fromNow', ['$filter', function ($filter) {
        	return function(date) {
        		return moment.unix(date).fromNow(); 
        	};
    	}])
        .filter('percentage', ['$filter', function ($filter) {
    	  return function (input, decimals) {
    	    return ($filter('number')(input * 100, decimals) || 0) + '%';
    	  };
    	}])
        .filter('kilos', ['$filter', function ($filter) {
          return function (input) {
            return input > 999 ? (input/1000).toFixed(1) + 'k' : input;
          };
        }])    
        .filter('goodrating', ['$filter', function ($filter) {
    	  return function (input) {
    	  	var c = 0;
            for(i=0;i<input.length;i++) {
                try{ if(input[i].extraInfo.global_rating>0) c++; } catch(e) {}
            }
            return c;
    	  };
        }])
        .filter('emblemUrl', ['$filter', function ($filter) {
          return function (input) {
            var c;
            try{ 
                c = "http://eu.wargaming.net/clans/media/clans/emblems/cl_" + input.slice(input.length-3) + "/" + input + "/emblem_195x195.png"; 
            } catch(e) {}
            return c;
          };
        }])  
        .filter('lowerAndNoSpaces', ['$filter', function ($filter) {
          return function (input) {
            return $filter('lowercase')(input.replace(/ /g, '_'));
          };
        }]);

}());