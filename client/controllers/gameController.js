app.controller('gameController', function($scope, $window, $location, pokemonFactory, loginFactory, amazonFactory, mapFactory){
    

        
//    moveplayer functions
    
    var playerDiv = angular.element(document).find("#player");
    
    var displayPlayer = function(){
        playerDiv.css("left", `${wherePlayer.x}px`);
        playerDiv.css("top", `${wherePlayer.y}px`);
    };
    
    var wherePlayer = {
        movingX: false,
        movingY: false,
        lastDirX: 'right',
        lastDirY: 'down',
        lastDir: 'down'
    };
    
    var stopPlayer = function(){
        if(wherePlayer.movingX || wherePlayer.movingY){
            wherePlayer.movingX = false;
            wherePlayer.movingY = false;
        }
    };
    
    
    
    $scope.disableControls = false;
    $scope.keypressdown = function(e){
        if (!$scope.disableControls){
            if(e.keyCode==37){
                if(!wherePlayer.movingLeft && !wherePlayer.movingUp && !wherePlayer.movingRight && !wherePlayer.movingDown ){
                    wherePlayer.movingX = 'left';
                }
            };
            if(e.keyCode==38){
                if(!wherePlayer.movingLeft && !wherePlayer.movingUp && !wherePlayer.movingRight && !wherePlayer.movingDown ){
                    wherePlayer.movingY = 'up';
                }
            };
            if(e.keyCode==39){
                if(!wherePlayer.movingLeft && !wherePlayer.movingUp && !wherePlayer.movingRight && !wherePlayer.movingDown ){
                    wherePlayer.movingX = 'right';
                }
            };
            if(e.keyCode==40){
                if(!wherePlayer.movingLeft && !wherePlayer.movingUp && !wherePlayer.movingRight && !wherePlayer.movingDown ){
                    wherePlayer.movingY = 'down';
                }
            };  
        };
        console.log(wherePlayer)
    };
    $scope.keypressup = function(e){
        if (!$scope.disableControls){
            if(e.keyCode==37){
                wherePlayer.movingX = false;
                wherePlayer.lastDirX = 'left';
                wherePlayer.lastDir = 'left';
            };
            if(e.keyCode==38){
                wherePlayer.movingY = false;
                wherePlayer.lastDirY = 'up';
                wherePlayer.lastDir = 'up';
            };
            if(e.keyCode==39){
                wherePlayer.movingX = false;
                wherePlayer.lastDirX = 'right';
                wherePlayer.lastDir = 'right';
            };
            if(e.keyCode==40){
                wherePlayer.movingY = false;
                wherePlayer.lastDirY = 'down';
                wherePlayer.lastDir = 'down';
            };
        };
//        console.log(wherePlayer);
    };
    var probed = true;
    
    var playerSurroundings = [[0,0,0],
                             [0,0,0],
                             [0,0,0]];
    
    
    function probeSurroundings(callback){
        var playerX = wherePlayer.x/32;
        var playerY = wherePlayer.y/32;
        for(var i = 0; i < 3; i++){
            for(var k = 0; k < 3; k++){
                if(playerX + k - 1 < 0 || playerX + k - 1 > 19 || playerY + i - 1 < 0 || playerY + i - 1 > 14){
                    console.log("at the edge");
                    playerSurroundings[i][k] = [0,0,0,"U",0];
                } else {
                    playerSurroundings[i][k] = $scope.currentMap.map.compiled[playerY+i-1][playerX+k-1];
                }
            }
        };
        probed = true; 
        callback();
    };
    
    var movePlayer = function(){
        if(wherePlayer.movingX && !wherePlayer.movingY && wherePlayer.y%32 === 0){
            if(wherePlayer.movingX === 'left'){
                if(playerSurroundings[1][0][3] !== "U"){
                    wherePlayer.x -= 4;
                    if(!(playerDiv.css('animation')=='walk-left 0.4s steps(3) infinite')){
                        playerDiv.css('animation', 'walk-left 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
            if(wherePlayer.movingX === 'right'){
                if(playerSurroundings[1][2][3] !== "U"){
                    wherePlayer.x += 4;
                    if(!(playerDiv.css('animation')=='walk-right 0.4s steps(3) infinite')){
                        playerDiv.css('animation', 'walk-right 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
        }
        if(wherePlayer.movingY && !wherePlayer.movingX && wherePlayer.x%32 === 0){
            if(wherePlayer.movingY === 'up'){
                if(playerSurroundings[0][1][3] !== "U"){
                    wherePlayer.y -= 4;
                    if(!(playerDiv.css('animation')=='walk-up 0.4s steps(3) infinite')){
                        playerDiv.css('animation', 'walk-up 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
            if(wherePlayer.movingY === 'down'){
                if(playerSurroundings[2][1][3] !== "U"){
                    wherePlayer.y += 4;
                    if(!(playerDiv.css('animation')=='walk-down 0.4s steps(3) infinite')){
                        playerDiv.css('animation', 'walk-down 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
        }
        if (!wherePlayer.movingX){
            if(!(wherePlayer.x%32===0)){
                if(wherePlayer.lastDirX === 'left'){
                    wherePlayer.x -= 4;
                } else if (wherePlayer.lastDirX === 'right'){
                    wherePlayer.x += 4;
                }
            }
        }
        if (!wherePlayer.movingY){
            if(!(wherePlayer.y%32 === 0)){
                if(wherePlayer.lastDirY === 'up'){
                    wherePlayer.y -= 4;
                } else if (wherePlayer.lastDirY === 'down'){
                    wherePlayer.y += 4;
                }
            }
        }
        if (!wherePlayer.movingY && !wherePlayer.movingX && wherePlayer.x%32 === 0 && wherePlayer.y%32 === 0){
            if(wherePlayer.lastDir === 'left'){
                playerDiv.css('animation', 'stand-left 2.0s steps(1) infinite')
            } else if(wherePlayer.lastDir === 'up'){
                playerDiv.css('animation', 'stand-up 2.0s steps(1) infinite')
            } else if(wherePlayer.lastDir === 'right'){
                playerDiv.css('animation', 'stand-right 2.0s steps(1) infinite')
            } else if(wherePlayer.lastDir === 'down'){
                playerDiv.css('animation', 'stand-down 2.0s steps(1) infinite')
            }
        };
        if (wherePlayer.x%32 === 0 && wherePlayer.y%32 === 0 && !probed){
            probeSurroundings(function(){
                if(atDoor()){
                    moveDoor();
                }
            });
        };
        if (playerSurroundings[1][1][5] === "P"){
            console.log("on path");
            console.log(playerSurroundings);
            if(playerSurroundings[0][1] == [0,0,0,"U",0] && wherePlayer.movingY == "up"){
                console.log("moving up on path");
                movePath();
            } else if (playerSurroundings[2][1] == [0,0,0,"U",0] && wherePlayer.movingY == "down"){
                console.log("moving down on path");
                movePath();
            } else if (playerSurroundings[1][0] == [0,0,0,"U",0] && wherePlayer.movingY == "left"){
                console.log("moving left on path");
                movePath();
            } else if (playerSurroundings[1][2] == [0,0,0,"U",0] && wherePlayer.movingY == "right"){
                console.log("moving right on path");
                movePath();
            }
        }                
        
    };
    
    function atDoor(){
        if(playerSurroundings[1][1][4] == "D"){
            return true;
        } else {
            return false;
        }
    };
    
    function moveDoor(){
        var xCoord = Math.floor(wherePlayer.x/32);
        var yCoord = Math.floor(wherePlayer.y/32);
        console.log(xCoord + "-" + yCoord);
    };
    
    function movePath(){
        var xCoord = Math.floor(wherePlayer.x/32);
        var yCoord = Math.floor(wherePlayer.y/32);
        console.log(xCoord + "-" + yCoord);
    }
//    map functions
    
    $scope.currentMap ={
        mapCoordinates: "20,20"
    }
    
    $scope.fetchMap = function(){
        mapFactory.fetchMap($scope.currentMap.mapCoordinates, function(data){
            $scope.currentMap = data;
            $scope.rawMap = data.map.raw;
            wherePlayer.x = $scope.currentMap.playerLocation.x;
            wherePlayer.y = $scope.currentMap.playerLocation.y;
            wherePlayer.lastDir = $scope.currentMap.playerLocation.facing;
            displayPlayer();
//            console.log(data);
            probeSurroundings(function(){
            });
            startAnimating(targetFPS);
            console.log("fetching map");
        });
    };
    
    $scope.keypress = function(event){
        console.log(event);
    }
    
    $scope.fetchMap();
    
    var checkUser = function(callback){
        loginFactory.checkUser(function(data){
//            console.log(data);
            $scope.user = data.data.user;
//            console.log($scope.user);
        })
        callback();
    }
    checkUser(function(){
 
    });
    
    $scope.showBattlePartial = false;
    
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
//            console.log(data);
            if(data.cached){
//                console.log("found cached");
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
//                    console.log(j);
//                    console.log('getting move - ', j+1);
                    pokemonFactory.getMove(data.data.moves[j].move.url, function(move){
//                        console.log(move.data);
                        newpokemon.moves.push(move.data);
                        if(newpokemon.moves.length == 2){
//                            console.log("next step");
                            for (var k = 0; k < data.data.types.length; k++){
                                newpokemon.types.push(data.data.types[k].type.name);
                                if(k == data.data.types.length - 1){
//                                    console.log("last step");
                                    pokemonFactory.getAbility(data.data.abilities[0].ability.url, function(ability){
                                        newpokemon.abilities.push(ability.data);
                                        pokemonFactory.cachePokemon(newpokemon, function(data){
//                                            console.log("pokemon cached");
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
//        console.log("generating " + difficulty + " difficulty encounter pokemon");
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
    
    function fightAnimate(atk_id,def_id){
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
            setTimeout(function(){fightAnimate(1, 2)},500);
            attackerSound = new Audio(attacker.mp3);
            defenderSound = new Audio(defender.mp3);
        } else {
            var defender = $scope.user.pokemons[$scope.currentPokemonIdx];
            var attacker = $scope.enemyPokemonLow;
            attackerSound = new Audio(attacker.mp3);
            defenderSound = new Audio(defender.mp3);
            setTimeout(function(){fightAnimate(2, 1)},500);
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
    };
    //    Animation Functions
    var stop = false;
    var frameCount = 0;
    var $results = $("#results");
    var fps, fpsInterval, startTime, now, then, elapsed;
    var targetFPS = 60;

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }
    
    
    function animate() {
//        console.log("start animation");
        requestAnimationFrame(animate);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            movePlayer();
            if(playerDiv === null){
                animate = '';
            }
            else {
                displayPlayer();
            }
        }
    }
})