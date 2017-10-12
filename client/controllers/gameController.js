app.controller('gameController', function($scope, $location, pokemonFactory, loginFactory, amazonFactory){
    var checkUser = function(callback){
        loginFactory.checkUser(function(data){
            console.log(data);
            $scope.user = data.data.user;
            console.log($scope.user);
        })
        callback();
    }
    checkUser(function(){
 
    });
    
//    amazon product api sample query
//    $scope.items = [];
//    $scope.item = {};
//    $scope.item0; = "http://ecx.images-amazon.com/images/I/519SmJtgltL._SL160_.jpg";
    $scope.enemyPokemonLow = {};
    $scope.enemyPokemonMid = {};
    $scope.enemyPokemonHigh = {};
    $scope.enemyPokemonRandom = {};
    $scope.searchItem = function(query, callback){
//        console.log(query);
        amazonFactory.searchForItems(query, function(data){
            console.log(data);
            if (data.data.results){
                var results = data.data.results.Items.Item;
                console.log(results);
                for (var h = 0; h < results.length; h++){
                    var newItem = {
                        ASIN: results[h].ASIN,
                        IMGURL: "https://s13.postimg.org/iisqran5z/Pokeball.png",
                        DetailPageURL: results[h].DetailPageURL,
                        SearchIndex: query.searchIndex,
                        Keywords: query.keywords
                    }
                    try{
                        newItem.IMGURL = results[h].MediumImage.URL;
                    }
                    catch(err){
                        console.log(err);
                    }
                    amazonFactory.addItemToDB(newItem, function(data1){
                        console.log(data1);
                    })
                }                
            } else if (data.data.errors){
                var results = data.data.errors.Items.Item;
                console.log(results);
                for (var h = 0; h < results.length; h++){
                    var newItem = {
                        ASIN: results[h].ASIN,
                        IMGURL: "https://s13.postimg.org/iisqran5z/Pokeball.png",
                        DetailPageURL: results[h].DetailPageURL,
                        SearchIndex: query.searchIndex,
                        Keywords: query.keywords
                    }
                    try{
                        newItem.IMGURL = results[h].MediumImage.URL;
                    }
                    catch(err){
                        console.log(err);
                    }
                    amazonFactory.addItemToDB(newItem, function(data1){
                        console.log(data1);
                    })
                }  
            }
            callback(data);
        })
    };
    
    $scope.addItemToCart = function(ASIN, callback){
        amazonFactory.addItemToCart(ASIN, function(data){
            callback(data);
        })
    };
    
    $scope.displayCart = function(callback){
        amazonFactory.displayCart(function(data){
            callback(data);
        })
    }
    
    $scope.battlePartialUrl = 'partials/battle.html';
    $scope.shoppingCartUrl = 'partials/shoppingCart.html';
    
    var generatePokemon = function(pokeId, callback){
        pokemonFactory.getNewPokemon(pokeId, function(data){
            console.log(data);
            if(data.cached){
                console.log("found cached");
                return callback(data.data.data);
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
                        console.log(move.data);
                        newpokemon.moves.push(move.data);
                        if(newpokemon.moves.length == 2){
                            console.log("next step");
                            for (var k = 0; k < data.data.types.length; k++){
                                newpokemon.types.push(data.data.types[k].type.name);
                                if(k == data.data.types.length - 1){
                                    console.log("last step");
                                    pokemonFactory.getAbility(data.data.abilities[0].ability.url, function(ability){
                                        newpokemon.abilities.push(ability.data);
                                        pokemonFactory.cachePokemon(newpokemon, function(data){
                                            console.log("pokemon cached");
                                            return callback(newpokemon);
                                        })
                                    })
                                }
                            }
                        }
                    })
                };
            }
        })
    }
    
    var generateRandomPokemon = function(firstPokeId, lastPokeId, difficulty){
        console.log("generating " + difficulty + " difficulty encounter pokemon");
        var enemyPokemon;
        var randomRange;
        var rangeOffset;
        if(firstPokeId === lastPokeId){
            enemyPokemon = generatePokemon(firstPokeId);
        } else if (firstPokeId < lastPokeId){
            randomRange = lastPokeId - firstPokeId;
            rangeOffset = firstPokeId;
            generatePokemon(Math.floor(Math.random()*randomRange+rangeOffset), function(newPokemon){
                enemyPokemon = newPokemon;
                if(difficulty == "low"){
                    $scope.enemyPokemonLow = enemyPokemon;
                } else if(difficulty == "mid"){
                    $scope.enemyPokemonMid = enemyPokemon;
                } else if(difficulty == "high"){
                    $scope.enemyPokemonHigh = enemyPokemon;
                } else if(difficulty == "random"){
                    $scope.enemyPokemonRandom = enemyPokemon;
                } else {
                    return console.log("no where to put random pokemon");
                }
            });
        } else {
            randomRange = firstPokeId - lastPokeId;
            rangeOffset = lastPokeId;
            generatePokemon(Math.floor(Math.random()*randomRange+rangeOffset), function(newPokemon){
                enemyPokemon = newPokemon;
                if(difficulty == "low"){
                    $scope.enemyPokemonLow = enemyPokemon;
                } else if(difficulty == "mid"){
                    $scope.enemyPokemonMid = enemyPokemon;
                } else if(difficulty == "high"){
                    $scope.enemyPokemonHigh = enemyPokemon;
                } else if(difficulty == "random"){
                    $scope.enemyPokemonRandom = enemyPokemon;
                } else {
                    return console.log("no where to put random pokemon");
                }
            });
        }
        
        
    };
    
    generateRandomPokemon(1, 721, 'low');
    generateRandomPokemon(200, 400, 'mid');
    generateRandomPokemon(401, 721, 'high');
    generateRandomPokemon(1, 721, "random");
    
    // game Engine
    var pokemontype = {
        'normal':{
            'normal':1,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':1,
            'fighting':1,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':1,
            'bug':1,
            'rock':0.5,
            'ghost':0,
            'dragon':1,
            'dark':1,
            'steel':0.5,
            'fairy':1
        },
        'fire':{
            'normal':1,
            'fire':0.5,
            'water':0.5,
            'electric':1,
            'grass':2,
            'ice':2,
            'fighting':1,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':1,
            'bug':2,
            'rock':0.5,
            'ghost':0,
            'dragon':1,
            'dark':1,
            'steel':0.5,
            'fairy':1
        },
        'water':{
            'normal':1,
            'fire':2,
            'water':0.5,
            'electric':1,
            'grass':0.5,
            'ice':1,
            'fighting':1,
            'poison':1,
            'ground':2,
            'flying':1,
            'psychic':1,
            'bug':1,
            'rock':2,
            'ghost':1,
            'dragon':0.5,
            'dark':1,
            'steel':2,
            'fairy':1
        },
        'electric':{
            'normal':1,
            'fire':1,
            'water':2,
            'electric':0.5,
            'grass':0.5,
            'ice':1,
            'fighting':1,
            'poison':1,
            'ground':0,
            'flying':2,
            'psychic':1,
            'bug':1,
            'rock':1,
            'ghost':1,
            'dragon':0.5,
            'dark':1,
            'steel':1,
            'fairy':1
        },
        'grass':{
            'normal':1,
            'fire':0.5,
            'water':2,
            'electric':1,
            'grass':0.5,
            'ice':1,
            'fighting':1,
            'poison':0.5,
            'ground':2,
            'flying':0.5,
            'psychic':1,
            'bug':0.5,
            'rock':2,
            'ghost':1,
            'dragon':0.5,
            'dark':1,
            'steel':0.5,
            'fairy':1
        },
        'ice':{
            'normal':1,
            'fire':0.5,
            'water':0.5,
            'electric':1,
            'grass':2,
            'ice':0.5,
            'fighting':1,
            'poison':1,
            'ground':2,
            'flying':2,
            'psychic':1,
            'bug':1,
            'rock':1,
            'ghost':1,
            'dragon':2,
            'dark':1,
            'steel':0.5,
            'fairy':1
        },
        'fighting':{
            'normal':2,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':2,
            'fighting':1,
            'poison':0.5,
            'ground':1,
            'flying':0.5,
            'psychic':0.5,
            'bug':0.5,
            'rock':2,
            'ghost':0,
            'dragon':1,
            'dark':2,
            'steel':2,
            'fairy':0.5
        },
        'poison':{
            'normal':1,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':2,
            'ice':1,
            'fighting':1,
            'poison':0.5,
            'ground':0.5,
            'flying':1,
            'psychic':1,
            'bug':1,
            'rock':0.5,
            'ghost':0.5,
            'dragon':1,
            'dark':1,
            'steel':0,
            'fairy':2
        },
        'ground':{
            'normal':1,
            'fire':2,
            'water':1,
            'electric':2,
            'grass':0.5,
            'ice':1,
            'fighting':1,
            'poison':2,
            'ground':1,
            'flying':0,
            'psychic':1,
            'bug':0.5,
            'rock':2,
            'ghost':1,
            'dragon':1,
            'dark':1,
            'steel':2,
            'fairy':1
        },
        'flying':{
            'normal':1,
            'fire':1,
            'water':1,
            'electric':0.5,
            'grass':2,
            'ice':1,
            'fighting':2,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':1,
            'bug':2,
            'rock':0.5,
            'ghost':1,
            'dragon':1,
            'dark':1,
            'steel':0.5,
            'fairy':1
        },
        'psychic':{
            'normal':1,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':1,
            'fighting':2,
            'poison':2,
            'ground':1,
            'flying':1,
            'psychic':0.5,
            'bug':1,
            'rock':1,
            'ghost':1,
            'dragon':1,
            'dark':0,
            'steel':0.5,
            'fairy':1
        },
        'bug':{
            'normal':1,
            'fire':0.5,
            'water':1,
            'electric':1,
            'grass':2,
            'ice':1,
            'fighting':0.5,
            'poison':0.5,
            'ground':1,
            'flying':0.5,
            'psychic':2,
            'bug':1,
            'rock':1,
            'ghost':0.5,
            'dragon':1,
            'dark':2,
            'steel':0.5,
            'fairy':0.5
        },
        'rock':{
            'normal':1,
            'fire':2,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':2,
            'fighting':0.5,
            'poison':1,
            'ground':0.5,
            'flying':2,
            'psychic':1,
            'bug':2,
            'rock':1,
            'ghost':1,
            'dragon':1,
            'dark':1,
            'steel':0.5,
            'fairy':1
        },
        'ghost':{
            'normal':0,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':1,
            'fighting':1,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':2,
            'bug':1,
            'rock':1,
            'ghost':2,
            'dragon':1,
            'dark':0.5,
            'steel':1,
            'fairy':1
        },
        'dragon':{
            'normal':1,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':1,
            'fighting':1,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':1,
            'bug':1,
            'rock':1,
            'ghost':1,
            'dragon':2,
            'dark':1,
            'steel':1,
            'fairy':1
        },
        'dark':{
            'normal':1,
            'fire':1,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':1,
            'fighting':0.5,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':2,
            'bug':1,
            'rock':1,
            'ghost':2,
            'dragon':1,
            'dark':0.5,
            'steel':1,
            'fairy':0.5
        },
        'steel':{
            'normal':1,
            'fire':0.5,
            'water':0.5,
            'electric':0.5,
            'grass':1,
            'ice':2,
            'fighting':1,
            'poison':1,
            'ground':1,
            'flying':1,
            'psychic':1,
            'bug':1,
            'rock':2,
            'ghost':1,
            'dragon':1,
            'dark':1,
            'steel':0.5,
            'fairy':2
        },
        'fairy':{
            'normal':1,
            'fire':0.5,
            'water':1,
            'electric':1,
            'grass':1,
            'ice':1,
            'fighting':2,
            'poison':0.5,
            'ground':1,
            'flying':1,
            'psychic':1,
            'bug':1,
            'rock':1,
            'ghost':1,
            'dragon':2,
            'dark':2,
            'steel':0.5,
            'fairy':1
        }
    };
    var hitSound = new Audio('assets/music/fx/punch.mp3');
    var missSound = new Audio('assets/music/fx/miss.mp3');
    var attackerSound;
    var defenderSound;
    $scope.currentPokemonIdx = 0;
    
    function calcmultiplier(attacker,defender){
        var multiplier = 1;
        var atkarr = attacker.types;
        var defarr = defender.types;
        for (var atkkey in atkarr){
            var atk = atkarr[atkkey];
            console.log(atk)
            for (var defkey in defarr){
                var def = defarr[defkey]
                console.log(def)
                console.log(pokemontype[atk][def])
                multiplier = multiplier * pokemontype[atk][def];
            }
        };
        return multiplier;
    }
    
    function animate(atk_id,def_id){
        if (atk_id == 1){
            atk_mot1 = '+=25px';
            atk_mot2 = '-=25px';
            def_mot1 = '-=15px';
            def_mot2 = '+=15px';
        } else if (atk_id == 2) {
            atk_mot1 = '-=25px';
            atk_mot2 = '+=25px';
            def_mot1 = '+=15px';
            def_mot2 = '-=15px';
        } else { return false }
        angular.element('.pokemon'+atk_id+'img').animate({left: atk_mot1}, 70);
        setTimeout(function(){angular.element('.pokemon'+atk_id+'img').animate({left: atk_mot2},100)},120);
        angular.element('.pokemon'+def_id+'img').animate({left: def_mot1}, 20);
        setTimeout(function(){angular.element('.pokemon'+def_id+'img').animate({left: def_mot2},20)},30);
        setTimeout(function(){angular.element('.pokemon'+def_id+'img').animate({left: def_mot1},20)},60);
        setTimeout(function(){angular.element('.pokemon'+def_id+'img').animate({left: def_mot2},20)},90);
    };
    
    $scope.attack = function(who){
        if (who === 1){
            var attacker = $scope.user.pokemons[$scope.currentPokemonIdx];
            var defender = $scope.enemyPokemonLow;
            setTimeout(function(){animate(1, 2)},500);
            attackerSound = new Audio(attacker.mp3);
            defenderSound = new Audio(defender.mp3);
        } else {
            var defender = $scope.user.pokemons[$scope.currentPokemonIdx];
            var attacker = $scope.enemyPokemonLow;
            attackerSound = new Audio(attacker.mp3);
            defenderSound = new Audio(defender.mp3);
            setTimeout(function(){animate(2, 1)},500);
        }
        var multiplier = calcmultiplier(attacker, defender);
        if (multiplier == 0){
            angular.element('#status').prepend('Attack has no effect'+'\n');
        } else if (multiplier > 0 && multiplier < 1) {
            angular.element('#status').prepend('Attack is not effective'+'\n');
        } else if (multiplier > 1 && multiplier < 2) {
            angular.element('#status').prepend('Attack is effective'+'\n')
        } else if (multiplier >= 2) {
            angular.element('#status').prepend('Attack is super effective'+'\n')
        } else {
            angular.element('#status').prepend('\n')
        };
        if (defender.id == undefined){
            return (angular.element('#status').prepend(attacker.name+' already won.  Stop beating a dead pokemon. \n\n\n'));
        };
        if (attacker.id == undefined) {
            return (angular.element('#status').prepend('What are you doing '+attacker.name+'?  You already lost.\n'+defender.name+' already won. \n \n'));
        };
        console.log(defender.def);
        var atk = Math.floor(attacker.atk*attacker.atk/defender.def*multiplier*.25*(Math.random()*.5+.5));
        if (atk > 0){
            attackerSound.play();
            setTimeout(function(){hitSound.play();},500);
//            setTimeout(function(){defenderSound.play();},700);
        };
        if (atk <= 0){
            attackerSound.play();
            setTimeout(function(){missSound.play();},500);
//            setTimeout(function(){defenderSound.play();},700);
        };
        angular.element('#status').prepend(attacker.name+' does '+atk+' damage. \n');
        angular.element('#status').prepend(attacker.name+' attacks '+defender.name+'\n');
        defender.hp -= atk;
        angular.element('#current'+2+'hp').html(defender.hp);
    }
})