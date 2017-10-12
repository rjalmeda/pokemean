app.factory('pokemonFactory', function($http){
    var factory = {};
    
//    old way without caching
//    factory.getNewPokemon = function(pokeid, callback){
//
//        $http.get(`https://pokeapi.co/api/v2/pokemon/${pokeid}`).then(function(data){
//
//            callback(data);
//        });
//    };
    
    factory.getNewPokemon = function(pokeid, callback){
        $http.get('/getNewPokemon/'+pokeid).then(function(data){
            callback(data.data);
        })
    };
    
    factory.getAbility = function(abilityUrl, callback){
        $http.get(abilityUrl).then(function(data){
            callback(data);
        })
    };
    factory.getMove = function(moveUrl, callback){
        $http.post('/getMove', {url: moveUrl}).then(function(data){
            callback(data.data);
        })
    };
    factory.popEgg = function(pokemon, callback){
        $http.post('/popEgg', pokemon).then(function(data){
            callback(data);
        })
    };
    factory.cachePokemon = function(pokemon, callback){
        $http.post('/cachePokemon', pokemon).then(function(data){
            callback(data);
        })
    };
    return factory;
});