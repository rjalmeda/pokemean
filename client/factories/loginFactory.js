app.factory('loginFactory', function($http){
    var factory = {};
    factory.login = function(user, callback){
        $http.post('/login', user).then(function(data){
            callback(data);
        })
    };
    factory.checkUser = function(callback){
        $http.get('/checkUser').then(function(data){
            callback(data);
        })
    };
    return factory;
});