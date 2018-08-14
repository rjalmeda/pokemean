app.factory('pokemonFactory', function($http){
    var factory = {};
    
    factory.getNewPokemon = function(pokeId, callback){
        $http.get('/getNewPokemon/'+pokeId).then(function(data){
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