var app = angular.module('app', ['ngRoute'])
app.config(function($routeProvider){
    $routeProvider
    .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'
    })
    .when('/splash', {
        templateUrl: 'partials/splash.html',
        controller: 'splashController'
    })
    .when('/lobby', {
        templateUrl: 'partials/lobby.html'
    })
    .when('/world', {
        templateUrl: 'partials/world.html',
        controller: 'gameController'
    })
    .when('/battle', {
        templateUrl: 'partials/battle.html'
    })
    .when('/mapeditor', {
        templateUrl: 'partials/mapeditor.html',
        controller: 'mapController'
    })
    .otherwise({
        redirectTo: '/login'
    })
});