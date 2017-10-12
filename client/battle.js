var hitsound = new Audio('assets/music/fx/punch.mp3');

//Pokemon Type Objects
var pokemontype = {
    'normal':{
        'normal':1,
        'fire':1,
        'water':1,
        'ele`ctric':1,
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

function calcmultiplier(attacker,defender){
    var multiplier = 1;
    var atkarr = attacker.types;
    var defarr = defender.types;
    for (var atkkey in atkarr){
        
    }
    for (var atkkey in atkarr){
        for (var defkey in defarr){
            multplier = multiplier * pokemontype[atkkey][defkey];
        }
    };
    return multiplier;
}

function changename(fromid, toid, targetplayer, emptyname){
    var playername = $(fromid).val();
    if (playername[0] == ' ' || playername == '') {
        playername = emptyname;
    }
    $(toid).html(playername);
    targetplayer.name = playername;
    $('#status').prepend('Changed Player '+targetplayer.id+' name to '+playername+'\n\n\n');
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
    $('.pokemon'+atk_id+'img').animate({left: atk_mot1}, 70);
    setTimeout(function(){$('.pokemon'+atk_id+'img').animate({left: atk_mot2},100)},120);
    $('.pokemon'+def_id+'img').animate({left: def_mot1}, 20);
    setTimeout(function(){$('.pokemon'+def_id+'img').animate({left: def_mot2},20)},30);
    setTimeout(function(){$('.pokemon'+def_id+'img').animate({left: def_mot1},20)},60);
    setTimeout(function(){$('.pokemon'+def_id+'img').animate({left: def_mot2},20)},90);
};


function playeratk(attacker, defender){
//    if (!checkready()){
//        return ($('#status').prepend('Players are not ready yet \n\n\n\n'))
//    }
    animate(1, 2);
    var multiplier = calcmultiplier(attacker, defender);
    if (multiplier == 0){
        $('#status').prepend('Attack has no effect'+'\n');
    } else if (multiplier > 0 && multiplier < 1) {
        $('#status').prepend('Attack is not effective'+'\n');
    } else if (multiplier > 1 && multiplier < 2) {
        $('#status').prepend('Attack is effective'+'\n')
    } else if (multiplier >= 2) {
        $('#status').prepend('Attack is super effective'+'\n')
    } else {
        $('#status').prepend('\n')
    };
    if (defender.id == undefined){
        return ($('#status').prepend(attacker.name+' already won.  Stop beating a dead pokemon. \n\n\n'));
    };
    if (attacker.id == undefined) {
        return ($('#status').prepend('What are you doing '+attacker.name+'?  You already lost.\n'+defender.name+' already won. \n \n'));
    };
    console.log(defender.currentpokemon.def);
    var atk = Math.floor(attacker.atk*attacker.atk/defender.def*multiplier*.25);
    if (atk > 0){
        hitsound.play()
    };
    $('#status').prepend(attacker.name+' does '+atk+' damage. \n');
    $('#status').prepend(attacker.name+' attacks '+defender.name+'\n');
    defender.hp -= atk;
    $('#current'+2+'hp').html(defender.hp);
//    var img_mod = '';
//    if (defender.id === 1) {
//        img_mod = 'back/';
//        height_mod = "height='280'";
//    } else if (defender.id === 2) {
//        img_mod = '';
//        height_mod = "height='150'";
//    }
//    if (defender.currentpokemon.hp<1&&defender.currentpokemonslot<2){
//        defender.currentpokemonslot += 1;
//        defender.currentpokemon = defender.pokemons[defender.currentpokemonslot];
//        $('#current'+defender.id+'hp').html(defender.currentpokemon.hp);
//        pic1url = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+img_mod+defender.currentpokemon.id+".png "+height_mod+" >"
//        $('.pokemon'+defender.id+'img').html(pic1url);
//    };
//    if (defender.currentpokemon.hp<1&&defender.currentpokemonslot==2){
//        $('#status').prepend('Player '+defender.id+' loses\n\n\n\n');
//        picurl = '';
//        healthzero = 0;
//        $('.pokemon'+defender.id+'img').html(picurl);
//        $('#current'+defender.id+'hp').html(healthzero);
//        defender.currentpokemon = {};
//    };
};

//$(document).ready(function(){
//    for (var i = 1; i<152; i++){
//    $("#player1_pokemon_list").append("<img class='pokemonimg' player='1' id="+i+" src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i+".png>");
//    $("#player2_pokemon_list").append("<img class='pokemonimg' player='2' id="+i+" src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i+".png>")};
//    
//});

//$(document).on('click', 'img', function(){
//    var player_id = $(this).attr('player');
//    $.ajax({
//        "url": "http://pokeapi.co/api/v2/pokemon/"+$(this).attr('id'),
//        "method": "GET",
//        "success": function(data){
////                alert(data.name+' joined Player '+player_id);
//            if (player_id==='1'){
//                if (player1.playerslot === 0){
//                    $('#player_1_slot1').html(data.name);
//                    player1.playerslot++;
//                    var pic1url = '';
//                    pic1url = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/"+data.id+".png height='280'>"
//                    picsmallurl = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='100'>"
//                    $('div.pokemon1img').html(pic1url);
//                    $('div#p1_s1_img').html(picsmallurl);
//                    player1.addPokemon(data);
//                    $('#p1_s1_hp').append(data.stats[5].base_stat);
//                    $('#p1_s1_atk').append(data.stats[4].base_stat);
//                    $('#p1_s1_def').append(data.stats[3].base_stat);
//                    $('#p1_s1_spd').append(data.stats[0].base_stat);
//                    player1.pokemons[0].hp = data.stats[5].base_stat;
//                    player1.pokemons[0].atk = data.stats[4].base_stat;
//                    player1.pokemons[0].def = data.stats[3].base_stat;
//                    player1.pokemons[0].spd = data.stats[0].base_stat;
//                    player1.currentpokemon = player1.pokemons[0];
//                    $('#current1hp').html(player1.currentpokemon.hp);
//                }
//                else if (player1.playerslot === 1) {
//                    $('#player_1_slot2').html(data.name);
//                    player1.addPokemon(data);
//                    picsmallurl = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='100'>"
//                    $('div#p1_s2_img').html(picsmallurl);
//                    player1.playerslot++;
//                    $('#p1_s2_hp').append(data.stats[5].base_stat);
//                    $('#p1_s2_atk').append(data.stats[4].base_stat);
//                    $('#p1_s2_def').append(data.stats[3].base_stat);
//                    $('#p1_s2_spd').append(data.stats[0].base_stat);
//                    player1.pokemons[1].hp = data.stats[5].base_stat;
//                    player1.pokemons[1].atk = data.stats[4].base_stat;
//                    player1.pokemons[1].def = data.stats[3].base_stat;
//                    player1.pokemons[1].spd = data.stats[0].base_stat;
//                    $('#current2hp').html(player1.currentpokemon.hp);
//                }
//                else if (player1.playerslot === 2) {
//                    $('#player_1_slot3').html(data.name);
//                    picsmallurl = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='100'>"
//                    $('div#p1_s3_img').html(picsmallurl);
//                    player1.addPokemon(data);
//                    player1.playerslot++;
//                    $('#p1_s3_hp').append(data.stats[5].base_stat);
//                    $('#p1_s3_atk').append(data.stats[4].base_stat);
//                    $('#p1_s3_def').append(data.stats[3].base_stat);
//                    $('#p1_s3_spd').append(data.stats[0].base_stat);
//                    player1.pokemons[2].hp = data.stats[5].base_stat;
//                    player1.pokemons[2].atk = data.stats[4].base_stat;
//                    player1.pokemons[2].def = data.stats[3].base_stat;
//                    player1.pokemons[2].spd = data.stats[0].base_stat;
//                }
//                else {
//                    $('#status').prepend(player1.name+' reached max pokemon\n\n\n');
//                }
//
//            }
//            else if (player_id==='2'){
//                if (player2.playerslot === 0){
//                    $('#player_2_slot1').html(data.name);
//                    player2.addPokemon(data);
//                    player2.playerslot++;
//                    var pic2url = '';
//                    pic2url = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='150'>"
//                    picsmallurl = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='100'>"
//                    $('div#p2_s1_img').html(picsmallurl);
//                    $('div.pokemon2img').html(pic2url);
//                    $('#p2_s1_hp').append(data.stats[5].base_stat);
//                    $('#p2_s1_atk').append(data.stats[4].base_stat);
//                    $('#p2_s1_def').append(data.stats[3].base_stat);
//                    $('#p2_s1_spd').append(data.stats[0].base_stat);
//                    player2.pokemons[0].hp = data.stats[5].base_stat;
//                    player2.pokemons[0].atk = data.stats[4].base_stat;
//                    player2.pokemons[0].def = data.stats[3].base_stat;
//                    player2.pokemons[0].spd = data.stats[0].base_stat;
//                    player2.currentpokemon = player2.pokemons[0];
//                }
//                else if (player2.playerslot === 1) {
//                    $('#player_2_slot2').html(data.name);
//                    player2.addPokemon(data);
//                    picsmallurl = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='100'>"
//                    $('div#p2_s2_img').html(picsmallurl);
//                    $('#p2_s2_hp').append(data.stats[5].base_stat);
//                    $('#p2_s2_atk').append(data.stats[4].base_stat);
//                    $('#p2_s2_def').append(data.stats[3].base_stat);
//                    $('#p2_s2_spd').append(data.stats[0].base_stat);
//                    player2.pokemons[1].hp = data.stats[5].base_stat;
//                    player2.pokemons[1].atk = data.stats[4].base_stat;
//                    player2.pokemons[1].def = data.stats[3].base_stat;
//                    player2.pokemons[1].spd = data.stats[0].base_stat;
//                    player2.playerslot++;
//                }
//                else if (player2.playerslot === 2) {
//                    $('#player_2_slot3').html(data.name);
//                    player2.addPokemon(data);
//                    picsmallurl = "<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.id+".png height='100'>"
//                    $('div#p2_s3_img').html(picsmallurl);
//                    $('#p2_s3_hp').append(data.stats[5].base_stat);
//                    $('#p2_s3_atk').append(data.stats[4].base_stat);
//                    $('#p2_s3_def').append(data.stats[3].base_stat);
//                    $('#p2_s3_spd').append(data.stats[0].base_stat);
//                    player2.pokemons[2].hp = data.stats[5].base_stat;
//                    player2.pokemons[2].atk = data.stats[4].base_stat;
//                    player2.pokemons[2].def = data.stats[3].base_stat;
//                    player2.pokemons[2].spd = data.stats[0].base_stat;
//                    player2.playerslot++;
//                }
//                else {
//                    $('#status').prepend(player2.name+' reached max pokemon \n\n\n');
//                }
//
//            }
//            else {
//                $('#status').prepend('what happened? \n\n\n')  
//            };
//        }
//    })
//})