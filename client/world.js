$(document).ready(function(){
    var stop = false;
    var frameCount = 0;
    var $results = $("#results");
    var fps, fpsInterval, startTime, now, then, elapsed;

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }
    
    function animate() {
        requestAnimationFrame(animate);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            
            movePlayer();
            if(document.getElementById('player') === null){
                animate = '';
            }
            if(document.getElementById('player').style.left){
                displayPlayer();
            }
        }
    }
    
    
    var currentMap = maps[1][3];
    var world = currentMap.map;
    var bgMusic = new Audio();
    var pokeMartItems = [];
    for (var i = 0; i < 40; i++){
        pokeMartItems[i] = {
            ASIN: "",
            DetailPageURL: "",
            IMGURL: ""
        };
    };
//    pokeMartItems[0] = `http://ecx.images-amazon.com/images/I/519SmJtgltL._SL160_.jpg`;
    bgMusic.src = currentMap.music;
    bgMusic.play();
    var displayWorld = function() {
        var worldOutput = '';
        for (var i=0; i<world.length; i++){
            worldOutput += '<div class="worldMapRow">';
            for (var j=0; j<world[i].length; j++){
                if(world[i][j]==0) worldOutput += '<div class="empty standardTile"></div>';
                if(world[i][j]==1) worldOutput += '<div class="grass standardTile"></div>';
                if(world[i][j]==2) worldOutput += '<div class="tallGrass standardTile"><div class="tallGrassBottom"></div></div>';
                if(world[i][j]==3) worldOutput += '<div class="tree standardTile"></div>';
                if(world[i][j]==4) worldOutput += '<div class="pathTopLeft standardTile"></div>';
                if(world[i][j]==5) worldOutput += '<div class="pathTop standardTile"></div>';
                if(world[i][j]=='5GR') worldOutput += '<div class="pathTop standardTile"><div class="npcGirlRight standardTile"></div></div>';
                if(world[i][j]==6) worldOutput += '<div class="pathTopRight standardTile"></div>';
                if(world[i][j]==7) worldOutput += '<div class="pathLeft standardTile"></div>';
                if(world[i][j]==8) worldOutput += '<div class="pathMiddle standardTile"></div>';
                if(world[i][j]==9) worldOutput += '<div class="pathRight standardTile"></div>';
                if(world[i][j]==10) worldOutput += '<div class="pathBottomLeft standardTile"></div>';
                if(world[i][j]==11) worldOutput += '<div class="pathBottom standardTile"></div>';
                if(world[i][j]==12) worldOutput += '<div class="pathBottomRight standardTile"></div>';
                if(world[i][j]==13) worldOutput += '<div class="grass standardTile"><div class="houseTopLeft standardTile"></div></div>';
                if(world[i][j]==14) worldOutput += '<div class="grass standardTile"><div class="houseTopRight standardTile"></div></div>';
                if(world[i][j]==15) worldOutput += '<div class="grass standardTile"><div class="houseLeft standardTile"></div></div>';
                if(world[i][j]==16) worldOutput += '<div class="grass standardTile"><div class="houseRight standardTile"></div></div>';
                if(world[i][j]==17) worldOutput += '<div class="grass standardTile"><div class="houseDoor standardTile"><div class="houseBottomLeft standardTile"></div></div></div>';
                if(world[i][j]=='17D') worldOutput += '<div class="grass standardTile"><div class="houseDoor standardTile"><div class="houseBottomLeft standardTile"><div class="npcDoc standardTile"></div></div></div></div>';
                if(world[i][j]==18) worldOutput += '<div class="grass standardTile"><div class="houseBottomRight standardTile"></div></div>';
                if(world[i][j]==19) worldOutput += '<div class="grass standardTile"><div class="pokeLabTopLeft standardTile"></div></div>';
                if(world[i][j]==20) worldOutput += '<div class="grass standardTile"><div class="pokeLabTop standardTile"></div></div>';
                if(world[i][j]==21) worldOutput += '<div class="grass standardTile"><div class="pokeLabTopRight standardTile"></div></div>';
                if(world[i][j]==22) worldOutput += '<div class="grass standardTile"><div class="pokeLabLeft standardTile"></div></div>';
                if(world[i][j]==23) worldOutput += '<div class="grass standardTile"><div class="pokeLabMiddle standardTile"></div></div>';
                if(world[i][j]==24) worldOutput += '<div class="grass standardTile"><div class="pokeLabRight standardTile"></div></div>';
                if(world[i][j]==25) worldOutput += '<div class="grass standardTile"><div class="pokeLabBottomLeft standardTile"></div></div>';
                if(world[i][j]==26) worldOutput += '<div class="grass standardTile"><div class="pokeLabBottom standardTile"></div></div>';
                if(world[i][j]==27) worldOutput += '<div class="grass standardTile"><div class="pokeLabBottomRight standardTile"></div></div>';
                if(world[i][j]==28) worldOutput += '<div class="grass standardTile"><div class="pokeMart28 standardTile"></div></div>';
                if(world[i][j]==29) worldOutput += '<div class="grass standardTile"><div class="pokeMart29 standardTile"></div></div>';
                if(world[i][j]==30) worldOutput += '<div class="grass standardTile"><div class="pokeMart30 standardTile"></div></div>';
                if(world[i][j]==31) worldOutput += '<div class="grass standardTile"><div class="pokeMart31 standardTile"></div></div>';
                if(world[i][j]==32) worldOutput += '<div class="grass standardTile"><div class="pokeMart32 standardTile"></div></div>';
                if(world[i][j]==33) worldOutput += '<div class="grass standardTile"><div class="pokeMart33 standardTile"></div></div>';
                if(world[i][j]==34) worldOutput += '<div class="grass standardTile"><div class="pokeMart34 standardTile"></div></div>';
                if(world[i][j]==35) worldOutput += '<div class="grass standardTile"><div class="pokeMart35 standardTile"></div></div>';
                if(world[i][j]==36) worldOutput += '<div class="grass standardTile"><div class="pokeMart36 standardTile"></div></div>';
                if(world[i][j]==37) worldOutput += '<div class="grass standardTile"><div class="pokeMart37 standardTile"></div></div>';
                if(world[i][j]==38) worldOutput += '<div class="grass standardTile"><div class="pokeMart38 standardTile"></div></div>';
                if(world[i][j]==39) worldOutput += '<div class="grass standardTile"><div class="pokeMart39 standardTile"></div></div>';
                if(world[i][j]==40) worldOutput += '<div class="grass standardTile"><div class="pokeMart40 standardTile"></div></div>';
                if(world[i][j]==41) worldOutput += '<div class="grass standardTile"><div class="pokeMart41 standardTile"></div></div>';
                if(world[i][j]==42) worldOutput += '<div class="grass standardTile"><div class="pokeMart42 standardTile"></div></div>';
                if(world[i][j]==43) worldOutput += '<div class="grass standardTile"><div class="pokeMart43 standardTile"></div></div>';
                if(world[i][j]==44) worldOutput += '<div class="grass standardTile"><div class="pokeMart44 standardTile"></div></div>';
                if(world[i][j]==45) worldOutput += '<div class="grass standardTile"><div class="pokeMart45 standardTile"></div></div>';
                if(world[i][j]==46) worldOutput += '<div class="grass standardTile"><div class="pokeMart46 standardTile"></div></div>';
                if(world[i][j]==47) worldOutput += '<div class="grass standardTile"><div class="pokeMart47 standardTile"></div></div>';
                if(world[i][j]==48) worldOutput += '<div class="grass standardTile"><div class="pokeMart48 standardTile"></div></div>';
                if(world[i][j]==49) worldOutput += '<div class="grass standardTile"><div class="pokeMart49 standardTile"></div></div>';
                if(world[i][j]==50) worldOutput += '<div class="grass standardTile"><div class="pokeMart50 standardTile"></div></div>';
                if(world[i][j]==51) worldOutput += '<div class="grass standardTile"><div class="pokeMart51 standardTile"></div></div>';
                if(world[i][j]==52) worldOutput += '<div class="grass standardTile"><div class="pokeMart52 standardTile"></div></div>';
                if(world[i][j]==53) worldOutput += '<div class="grass standardTile"><div class="pokeMart53 standardTile"></div></div>';
                if(world[i][j]==54) worldOutput += '<div class="grass standardTile"><div class="pokeMart54 standardTile"></div></div>';
                if(world[i][j]==55) worldOutput += '<div class="grass standardTile"><div class="pokeMart55 standardTile"></div></div>';
                if(world[i][j]==56) worldOutput += '<div class="grass standardTile"><div class="pokeMart56 standardTile"></div></div>';
                if(world[i][j]==57) worldOutput += '<div class="grass standardTile"><div class="pokeMart57 standardTile"></div></div>';
                if(world[i][j]==58) worldOutput += '<div class="pokeMartWallLeft1 standardTile"></div>';
                if(world[i][j]==59) worldOutput += '<div class="pokeMartWallLeft2 standardTile"></div>';
                if(world[i][j]==60) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartWallLeft3 standardTile"></div></div>';
                if(world[i][j]==61) worldOutput += '<div class="pokeMartWall1 standardTile"></div>';
                if(world[i][j]==62) worldOutput += '<div class="pokeMartWall2 standardTile"></div>';
                if(world[i][j]==63) worldOutput += '<div class="pokeMartWallRight1 standardTile"></div>';
                if(world[i][j]==64) worldOutput += '<div class="pokeMartWallRight2 standardTile"></div>';
                if(world[i][j]==65) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartWallRight3 standardTile"></div></div>';
                if(world[i][j]==66) worldOutput += '<div class="pokeMartFloor standardTile"></div>';
                if(world[i][j]==67) worldOutput += '<div class="pokeGymFloor standardTile"></div>';
                if(world[i][j]==68) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk68"></div></div>';
                if(world[i][j]==69) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk69 standardTile"></div></div>';
                if(world[i][j]==70) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk70 standardTile"></div></div>';
                if(world[i][j]==71) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk71 standardTile"></div></div>';
                if(world[i][j]==72) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk72 standardTile"></div></div>';
                if(world[i][j]==73) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk73 standardTile"></div></div>';
                if(world[i][j]==74) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk74 standardTile"></div></div>';
                if(world[i][j]==75) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile"></div></div>';
//                if(world[i][j]=="75-1") worldOutput += `<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile"><div class="pokeMartDeskItem" style="background: url(${item0});"></div></div></div>`;
//                if(world[i][j]=="75-2") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item2"><img ng-src="{{$scope.item2}}" height="25"></div></div>';
//                if(world[i][j]=="75-3") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item3"><img ng-src="{{$scope.item3}}" height="25"></div></div>';
//                if(world[i][j]=="75-4") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item4"><img ng-src="{{$scope.item4}}" height="25"></div></div>';
//                if(world[i][j]=="75-5") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item5"><img ng-src="{{$scope.item5}}" height="25"></div></div>';
//                if(world[i][j]=="75-6") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item6"><img ng-src="{{$scope.item6}}" height="25"></div></div>';
//                if(world[i][j]=="75-7") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item7"><img ng-src="{{$scope.item7}}" height="25"></div></div>';
//                if(world[i][j]=="75-8") worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile item8"><img ng-src="{{$scope.item8}}" height="25"></div></div>';
                if(world[i][j]==76) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk76 standardTile"></div></div>';
                if(world[i][j]=="74-0") worldOutput += `<div class="pokeMartFloor standardTile"><div class="pokeMartDesk74 standardTile"><img class="pokeMartDeskItem" src='${pokeMartItems[0].IMGURL}' height="16"></div></div>`;
                if(world[i][j]==`76-9`) worldOutput += `<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile"><img class="pokeMartDeskItem" src='${pokeMartItems[9].IMGURL}' height="16" href="${pokeMartItems[9].DetailPageURL}"></div></div>`;
                if(world[i][j]==77) worldOutput += '<div class="pokeMartFloor standardTile"><div class="pokeMartDesk77 standardTile"></div></div>';
                for (var k = 1; k < 9; k++){
                    if(world[i][j]==`75-${k}`) worldOutput += `<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile"><img class="pokeMartDeskItem" src='${pokeMartItems[k].IMGURL}' height="16"></div></div>`;
                };
//                for (var k = 1; k < 10; k++){
//                    if(world[i][j]==`75-${k}`) worldOutput += `<div class="pokeMartFloor standardTile"><div class="pokeMartDesk75 standardTile"><div class="pokeMartDeskItem"></div></div></div>`;
//                };
            }
            worldOutput += '</div>';
        }
        $('div.world').html(worldOutput);
        
    };
    
    $('#battlePartial').hide();
    
    var doorTiles = [17, 26, 55]
    var disableControls = false;
    var battleTriggered = false;
    
    var enemeyReadyLow = false;
    var enemeyReadyMid = false;
    var enemeyReadyHigh = false;
//    if (myCart == undefined){
//        var myCart = {};
//    }
    var passable = [1,2,4,5,6,7,8,9,10,11,12,13,14,17,19,20,21,26,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,48,53,47,52,57,55,66,67,68,70,71,72];
    var paths = [4,5,6,7,8,9,10,11,12];
    var wherePlayer = {
        movingX: false,
        movingY: false,
        lastDirX: 'right',
        lastDirY: 'down',
        lastDir: 'down',
        x: currentMap.playerLocation.x,
        y: currentMap.playerLocation.y
    };
    
    var encounterRate = 15;
//    encounterRate out of 100
    
    var playerSurroundings = [[1,1,1],
                              [1,'P',1],
                              [1,1,1]];
    
    var lookLeft = function(){
        for (var i = 0; i < passable.length; i++){
            if (playerSurroundings[1][0] === passable[i]){
                return true;
            }
        }
        return false;
    }
    var lookRight = function(){
        for (var i = 0; i < passable.length; i++){
            if (playerSurroundings[1][2] === passable[i]){
                return true;
            }
        }
        return false;
    }
    var lookUp = function(){
        for (var i = 0; i < passable.length; i++){
            if (playerSurroundings[0][1] === passable[i]){
                return true;
            }
        }
        return false;
    }
    var lookDown = function(){
        for (var i = 0; i < passable.length; i++){
            if (playerSurroundings[2][1] === passable[i]){
                return true;
            }
        }
        return false;
    }
    
//    
//    playerSurroundings  [A][D],[A][E],[A][F]
//                        [B][D],[B][E],[B][F]
//                        [C][D],[C][D],[C][F]
//    
//    posA = pY-1;
//    posB = pY;
//    posC = pY+1;
//    
//    posD = pX-1;
//    posE = pX;
//    posF = pX+1;
    
    var probed = true;
    
    var probeSurroundings = function(posX, posY, callback){
        probed = true;
        var pX = posX/32;
        var pY = posY/32;
        try {
            playerSurroundings[0][0] = currentMap.map[pY-1][pX-1];
            if (playerSurroundings[0][0] === null){
                playerSurroundings[0][0] = 0;
            }
            if (playerSurroundings[0][0] == undefined){
                playerSurroundings[0][0] = 0;
            }
        }
        catch(err){
            playerSurroundings[0][0] = 0;
        }
        try {
            playerSurroundings[0][1] = currentMap.map[pY-1][pX];
            if (playerSurroundings[0][1] === null){
                playerSurroundings[0][1] = 0;
            }
            if (playerSurroundings[0][1] == undefined){
                playerSurroundings[0][1] = 0;
            }
        }
        catch(err){
            playerSurroundings[0][1] = 0;
        }
        try {
            playerSurroundings[0][2] = currentMap.map[pY-1][pX+1];
            if (playerSurroundings[0][2] === null){
                playerSurroundings[0][2] = 0;
            }
            if (playerSurroundings[0][2] == undefined){
                playerSurroundings[0][2] = 0;
            }
        }
        catch(err){
            playerSurroundings[0][2] = 0;
        }
        try {
            playerSurroundings[1][0] = currentMap.map[pY][pX-1];
            if (playerSurroundings[1][0] === null){
                playerSurroundings[1][0] = 0;
            }
            if (playerSurroundings[1][0] == undefined){
                playerSurroundings[1][0] = 0;
            }
        }
        catch(err){
            playerSurroundings[1][0] = 0;
        }
        try {
            playerSurroundings[1][1] = currentMap.map[pY][pX];
        }
        catch(err){
            playerSurroundings[1][1] = 0;
        }
        try {
            playerSurroundings[1][2] = currentMap.map[pY][pX+1];
            if (playerSurroundings[1][2] === null){
                playerSurroundings[1][2] = 0;
            }
            if (playerSurroundings[1][2] == undefined){
                playerSurroundings[1][2] = 0;
            }
        }
        catch(err){
            playerSurroundings[1][2] = 0;
        }
        try {
            playerSurroundings[2][0] = currentMap.map[pY+1][pX-1];
            if (playerSurroundings[2][0] === null){
                playerSurroundings[2][0] = 0;
            }
            if (playerSurroundings[2][0] == undefined){
                playerSurroundings[2][0] = 0;
            }
        }
        catch(err){
            playerSurroundings[2][0] = 0;
        }
        try {
            playerSurroundings[2][1] = currentMap.map[pY+1][pX];
            if (playerSurroundings[2][1] === null){
                playerSurroundings[2][1] = 0;
            }
            if (playerSurroundings[2][1] == undefined){
                playerSurroundings[2][1] = 0;
            }
        }
        catch(err){
            playerSurroundings[2][1] = 0;
        }
        try {
            playerSurroundings[2][2] = currentMap.map[pY+1][pX+1];
            if (playerSurroundings[2][2] === null){
                playerSurroundings[2][2] = 0;
            }
            if (playerSurroundings[2][2] == undefined){
                playerSurroundings[2][2] = 0;
            }
        }
        catch(err){
            playerSurroundings[2][2] = 0;
        }
        return callback();
    };
    probeSurroundings(wherePlayer.x, wherePlayer.y, function(){
        console.log('initial probe');
    });
    var displayPlayer = function(){
        document.getElementById('player').style.left = wherePlayer.x+'px';
        document.getElementById('player').style.top = wherePlayer.y+'px';
    };
    displayPlayer();
    
    var atDoor = function(){
        for (var i = 0; i<doorTiles.length; i++){
            if(playerSurroundings[1][1] == doorTiles[i]){
                console.log('I am at a door');
                return true;
            }
        };
        return false;
    }
    

//    Angular Scope Items
    var ae = angular.element('#ngview').scope();
    console.log(ae);
    
    var movePlayer = function(){
        if(wherePlayer.movingX && !wherePlayer.movingY && wherePlayer.y%32 === 0){
            if(wherePlayer.movingX === 'left'){
                if(lookLeft()){
                    wherePlayer.x -= 4;
                    if(!($('#player').css('animation')=='walk-left 0.4s steps(3) infinite')){
                        $('#player').css('animation', 'walk-left 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
            if(wherePlayer.movingX === 'right'){
                if(lookRight()){
                    wherePlayer.x += 4;
                    if(!($('#player').css('animation')=='walk-right 0.4s steps(3) infinite')){
                        $('#player').css('animation', 'walk-right 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
        }
        if(wherePlayer.movingY && !wherePlayer.movingX && wherePlayer.x%32 === 0){
            if(wherePlayer.movingY === 'up'){
                if(lookUp()){
                    wherePlayer.y -= 4;
                    if(!($('#player').css('animation')=='walk-up 0.4s steps(3) infinite')){
                        $('#player').css('animation', 'walk-up 0.4s steps(3) infinite');
                    }
                    if(probed){
                       probed=false;
                    }
                }
            }
            if(wherePlayer.movingY === 'down'){
                if(lookDown()){
                    wherePlayer.y += 4;
                    if(!($('#player').css('animation')=='walk-down 0.4s steps(3) infinite')){
                        $('#player').css('animation', 'walk-down 0.4s steps(3) infinite');
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
                $('#player').css('animation', 'stand-left 2.0s steps(1) infinite')
            } else if(wherePlayer.lastDir === 'up'){
                $('#player').css('animation', 'stand-up 2.0s steps(1) infinite')
            } else if(wherePlayer.lastDir === 'right'){
                $('#player').css('animation', 'stand-right 2.0s steps(1) infinite')
            } else if(wherePlayer.lastDir === 'down'){
                $('#player').css('animation', 'stand-down 2.0s steps(1) infinite')
            }
        }
        
        if (wherePlayer.x%32 === 0 && wherePlayer.y%32 === 0 && !probed){
            probeSurroundings(wherePlayer.x, wherePlayer.y, function(){
                if(atDoor()){
                    moveDoor();
                }
                if (playerSurroundings[1][1] === 2){
                    var encounter = Math.floor(Math.random()*101);
                    var enemyReady = true;
                    if (encounter < encounterRate && !battleTriggered && enemyReady){
                        bgMusic.src = "assets/music/music/battle(wild).mp3";
                        bgMusic.play();
                        battleTriggered = true;
                        console.log('trigger battle')
                        $('#battlePartial').show('slow', function(){
                            disableControls = true;
                            stopPlayer();
                            console.log('start battle functions!')
                            setTimeout(function(){
                                $('.pokemon2img').show('slow', function(){
                                    $('#battleinfo2').show('fast');
                                    $('#status').prepend(`A wild ${ae.enemyPokemonLow.name} appears! \n\n`)
                                    $('.cry2').html(`<audio autoplay><source src="assets/sounds/${ae.enemyPokemonLow.id}.ogg"><source src="{assets/sounds/${ae.enemyPokemonLow.id}.mp3"></audio>`);
                                })
                            }, 1500);
                            setTimeout(function(){
                                $('#status').prepend(`Go get em' ${ae.user.pokemons[0].name}! \n`)
                                setTimeout(function(){
                                    $('#status').prepend(`${ae.user.pokemons[0].name}! \n`)
                                    $('.pokemon1img').show('slow', function(){
                                    $('#battleinfo1').show('fast');
                                    $('.cry1').html(`<audio autoplay><source src="assets/sounds/${ae.user.pokemons[0].id}.ogg"><source src="{assets/sounds/${ae.user.pokemons[0].id}.mp3"></audio>`);
                                    $('.battleControls').slideDown('slow');
                                })}, 1250);
                            }, 3200);
                        });
                    }
                }
            });
        }
        if(onPath()){
            if(!lookDown() && wherePlayer.movingY == "down"){
                movePath();
            } else if(!lookRight() && wherePlayer.movingX == "right"){
                movePath();
            } else if(!lookLeft() && wherePlayer.movingX == "left"){
                movePath();
            } else if(!lookUp && wherePlayer.movingY == "up"){
                movePath();
            }
        }
    };
    
    var onPath = function(){
        for (var k = 0; k < paths.length; k++){
            if (playerSurroundings[1][1] == paths[k]){
                return true;
            }
        };
        return false;
    }
    
    var moveDoor = function(){
        var doorID = wherePlayer.x.toString()+ wherePlayer.y.toString();
        console.log(doorID);
        for (var door in currentMap.doors){
            if (currentMap.doors[door][0] == doorID){
                console.log(currentMap.doors[door][1].mapY);
                console.log(currentMap.doors[door][1].mapX);
                currentMap = buildings[currentMap.doors[door][1].mapY][currentMap.doors[door][1].mapX];
                wherePlayer.lastDir = currentMap.playerLocation.facing;
                world = currentMap.map;
                wherePlayer.x = currentMap.playerLocation.x;
                wherePlayer.y = currentMap.playerLocation.y;
                wherePlayer.lastDir = currentMap.playerLocation.facing;
                probeSurroundings(wherePlayer.x, wherePlayer.y, function(){
                    console.log('moved through a door');
                });
                displayWorld();
                if (currentMap.music){
                    if (bgMusic.src != currentMap.music){
                        bgMusic.src = currentMap.music;
                        bgMusic.play();
                    }
                };
                if (currentMap.type == "store"){
                    console.log(ae);
                    var query = currentMap.storeQuery;
                    ae.searchItem(query, function(data){
                        var results = data.data.results.Items.Item;
                        for (var i = 0; i < results.length; i++){
//                            console.log(i);
                            pokeMartItems[i].ASIN = results[i].ASIN;
                            pokeMartItems[i].DetailPageURL = results[i].DetailPageURL;
                            console.log(i, results[i].MediumImage)
                            if (results[i].MediumImage === undefined){
                                pokeMartItems[i].IMGURL = "https://s13.postimg.org/iisqran5z/Pokeball.png";
                                displayWorld();
                            }
                            else {
                                pokeMartItems[i].IMGURL = results[i].MediumImage.URL;
                                displayWorld();
                            }
                        }
                    });
                    

                };
            };
        }
    }
    
    var sendCart = function(){
//        console.log(myCart);
        ae.displayCart(function(data){
//            console.log(data.data);
//            console.log(ae);
            var cart = data.data;
            console.log(cart);
            var FormattedURL = "";
            if (cart.Cart.PurchaseURL){
                FormattedURL = cart.Cart.PurchaseURL;
                FormattedURL = FormattedURL.substring(8);
            }
            cart.FormattedURL = FormattedURL;
            console.log(FormattedURL);
            ae.$$childTail.$$childTail.cart = cart;
            
        })
    }
    
    var toggleCart = function(){
        $('.shoppingCart').toggle("slide", {direction: "down"}, 1000);
    }
    
    var addItemToCart = function(){
        if (wherePlayer.lastDir == "up"){
            console.log(playerSurroundings[0][1]);
            if (playerSurroundings[0][1].length > 3){
               var itemIDX = playerSurroundings[0][1][3];
                console.log(itemIDX);
                ae.addItemToCart(pokeMartItems[itemIDX].ASIN, function(data){
                    console.log(data);
                    sendCart();
                    $('.shoppingCart').show('slow');
//                    if (data.errors){
//                        myCart = {
//                            CartId: data.data.errors.Cart.CartId,
//                            HMAC: data.data.errors.Cart.HMAC,
//                            items: data.data.errors.Cart.CartItems.CartItem,
//                            subtotal: data.data.errors.Cart.CartItems.SubTotal.FormattedPrice,
//                            url: data.data.errors.Cart.PurchaseURL
//                        };
//                    } else if (data.results){
//                        myCart = {
//                            CartId: data.data.results.Cart.CartId,
//                            HMAC: data.data.results.Cart.HMAC,
//                            items: data.data.results.Cart.CartItems.CartItem,
//                            subtotal: data.data.results.Cart.CartItems.SubTotal.FormattedPrice,
//                            url: data.data.results.Cart.PurchaseURL
//                        };
//                    }
                });
            }
            
        } else if (wherePlayer.lastDir == "down"){
            console.log(playerSurroundings[2][1]);
            if (playerSurroundings[2][1].length > 3){
               var itemIDX = playerSurroundings[2][1][3];
                console.log(itemIDX); 
            }
        } else if (wherePlayer.lastDir == "left"){
            console.log(playerSurroundings[1][0]);
            if (playerSurroundings[1][0].length  > 3){
               var itemIDX = playerSurroundings[1][0][3];
                console.log(itemIDX); 
            }
        } else if (wherePlayer.lastDir == "right"){
            console.log(playerSurroundings[1][2]);
            if (playerSurroundings[1][2].length > 3){
               var itemIDX = playerSurroundings[1][2][3];
                console.log(itemIDX); 
            }
        }
    }
    
    
    var movePath = function(){
        var pathID = wherePlayer.x.toString()+ wherePlayer.y.toString();
//        console.log(pathID);
        for (var i = 0; i<currentMap.paths.length; i++){
            if (pathID == currentMap.paths[i][0]){
//                console.log("path hit");
                var playerStartX = currentMap.paths[i][1].playerX;
                var playerStartY = currentMap.paths[i][1].playerY;
                currentMap = maps[currentMap.paths[i][1].mapY][currentMap.paths[i][1].mapX];
                world = currentMap.map;
                wherePlayer.x = playerStartX;
                wherePlayer.y = playerStartY;
                probeSurroundings(wherePlayer.x, wherePlayer.y, function(){
                    console.log('moved through a path');
                });
                displayWorld();
            }
        }
    }
    
    var stopPlayer = function(){
        if(wherePlayer.movingX || wherePlayer.movingY){
            wherePlayer.movingX = false;
            wherePlayer.movingY = false;
        }
    }
    
    var displayNPC = function(NPC){
        document.getElementById(NPC.name).style.left = NPC.x+'px';
        document.getElementById(NPC.name).style.top = NPC.y+'px';
    };
    
    var boy = {
        name : 'boy',
        x : 0,
        y : 0
    };
    
    document.onkeydown = function(e){
        if (!disableControls){
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
        }
    };
    
    document.onkeyup = function(e){
        if (!disableControls){
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
            if(e.keyCode==66){
                addItemToCart();
            }
            if(e.keyCode==67){
                toggleCart();
            }
        }
    };
    displayWorld();
    startAnimating(60);
})