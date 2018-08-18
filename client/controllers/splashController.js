app.controller('splashController', function($scope, $location, loginFactory, pokemonFactory){
    $scope.newpokemons = [];
    
    var pokecry = function(id){
        
    };
    
    $scope.loadingComplete = false;
    
    function getText(data){
        if (!data.flavor_text_entries){
            return "";
        } else {
            for (var i = 0; i < data.flavor_text_entries.length; i++){
                if (data.flavor_text_entries[i].language.name == "en"){
                    return data.flavor_text_entries[i].flavor_text;
                }
            }
            return "";
        }
    }
    
    function loadTestData(){
        return {
            "eggs" : [1]
        }
    }
    
    function checkUser(){
        loginFactory.checkUser(function(data){
            console.log(data);
            $scope.user = data.data.user
            if (!$scope.user){
                $scope.user = loadTestData();
            }
            
            var popAllEggs = function(index){
                var done = false;
                pokemonFactory.getNewPokemon($scope.user.eggs[index], function(data){
                    console.log(data);
                    if(data.cached){
                        console.log("found cached");
                        console.log(data.data.data);
                        $scope.newpokemons.push(data.data.data);
                        pokemonFactory.popEgg(data.data.data, function(data){
                            if(data.data.user.eggs.length === 0){
                                $scope.loadingComplete = true;
                            }
                        })
                    } else {
                        var newpokemon = {};
                        newpokemon.name = data.data.name.toUpperCase();
                        newpokemon.id = data.data.id;
                        newpokemon.moves = [];
                        newpokemon.types = [];
                        newpokemon.abilities = [];
                        newpokemon.hp = data.data.stats[5].base_stat;
                        newpokemon.currentHP = data.data.stats[5].base_stat;
                        newpokemon.spd = data.data.stats[0].base_stat;
                        newpokemon.def = data.data.stats[3].base_stat;
                        newpokemon.atk = data.data.stats[4].base_stat;
                        newpokemon.spcAtk = data.data.stats[2].base_stat;
                        newpokemon.spcDef = data.data.stats[1].base_stat;
                        newpokemon.lvl = 1;
                        newpokemon.xp = 0;
                        newpokemon.ogg = './assets/sounds/'+newpokemon.id+'.ogg';
                        newpokemon.mp3 = './assets/sounds/'+newpokemon.id+'.mp3';
                        for (var j = 0; j<2; j++){
                            console.log(j);
                            console.log('getting move - ', j+1);
                            pokemonFactory.getMove(data.data.moves[j].move.url, function(move){
                                move.data.text = getText(move.data);
                                newpokemon.moves.push(move.data);
                                if(newpokemon.moves.length == 2){
                                    console.log("next step");
                                    for (var k = 0; k < data.data.types.length; k++){
                                        newpokemon.types.push(data.data.types[k].type.name);
                                        if(k == data.data.types.length - 1){
                                            console.log("last step");
                                            pokemonFactory.getAbility(data.data.abilities[0].ability.url, function(ability){
                                                ability.data.text = getText(ability.data);
                                                newpokemon.abilities.push(ability.data);
                                                pokemonFactory.cachePokemon(newpokemon, function(data){
                                                    console.log("pokemon cached");
                                                    console.log(newpokemon);
                                                    $scope.newpokemons.push(newpokemon);
                                                    pokemonFactory.popEgg(newpokemon, function(data){
                                                        if(data.data.user.eggs.length === 0){
                                                            $scope.loadingComplete = true;
                                                        }
                                                    })
                                                })
                                            })
                                        }
                                    }
                                }
                            })
                        };
                    }
                    
                })
            };
            
            for (var z = 0; z < $scope.user.eggs.length ; z++){
                popAllEggs(z);
            }
        });
        
    };
    checkUser();
})

app.filter('capitalize', function(){
    return function(input){
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})