app.factory('amazonFactory', function($http){
    var factory = {};
    factory.searchForItems = function(query, callback){
        $http.post('/searchForItems', query).then(function(data){
            callback(data);
        })
    }
    factory.addItemToDB = function(item, callback){
        $http.post('/addItemToDB', item).then(function(data){
            callback(data);
        })
    }
    factory.addItemToCart = function(ASIN, callback){
        $http.post('/addItemToCart', {ASIN: ASIN}).then(function(data){
            callback(data);
        })
    }
    factory.displayCart = function(callback){
        $http.get('/displayCart').then(function(data){
            callback(data);
        })
    }
    return factory;
})