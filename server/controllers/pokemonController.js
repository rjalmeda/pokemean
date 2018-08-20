const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const bcrypt = require('bcryptjs');
const Pokemon = mongoose.model('Pokemon');
// const fastPokeCache = new (require('node-cache'))({ stdTTL: 120, checkperiod: 140 });
const slowPokeCache = mongoose.model('PokemonCache');
const PokemonTemplate = mongoose.model('PokemonTemplate');
const https = require('https');
const http = require('http');
const pokeApiHost = "https://pokeapi.co";

function pokeApiRequest(url, callback) {
    return new Promise((resolve, reject)=>{
        slowPokeCache.findOne({ url: url }, function (err, pokeRecord) {
            if (err) {
                if(!callback){
                    return reject({error: err});
                } else {
                    return callback({ error: err })
                }
            } else {
                if (pokeRecord) {
                    if (!callback){
                        return resolve({cached: true, data: pokeRecord.data});
                    } else {
                        return callback({ cached: true, data: pokeRecord.data })
                    }
                } else {
                    https.get(url, function (resp) {
                        let data = "";
    
                        resp.on('data', function (chunk) {
                            data += chunk;
                        });
    
                        resp.on('end', function () {
                            let parsed = JSON.parse(data);
                            //let cacheSaveResult = fastPokeCache.set(url, parsed);
                            let newRecord = new slowPokeCache({ url: url, data: parsed });
                            newRecord.save().then(function (recordData) {
                                if (!callback){
                                    return resolve({cached: false, data: parsed});
                                } else {
                                    return callback({ cached: false, data: parsed })
                                }
                            });
                        });
                    }).on('error', function (error) {
                        if (!callback){
                            return reject({error: error});
                        }
                        return callback({ error: error })
                    })
                }
            }
        })
    })
};


module.exports = (function () {
    return {
        getNewPokemon:  function (req, res) {
            function getText(data) {
                if (!data.flavor_text_entries) {
                    return "";
                } else {
                    for (var i = 0; i < data.flavor_text_entries.length; i++) {
                        if (data.flavor_text_entries[i].language.name == "en") {
                            return data.flavor_text_entries[i].flavor_text;
                        }
                    }
                    return "";
                }
            }

            async function generateNewPokemon(data){
                let pokemon = {};
                function getRandomMoveIdx(){
                    return Math.floor(data.moves.length * Math.random());
                }

                function getStat(stats, statName){
                    return stats.find(s=>{
                        return s.stat.name == statName;
                    })
                }
                
                // get random moves
                let moves = [];
                if (data.moves.length > 2){
                    while(moves.length < 2){
                        let moveIdx = getRandomMoveIdx();
                        if (!moves.includes(data.moves[moveIdx])){
                            moves.push(data.moves[moveIdx]);
                        }
                    };
                } else {
                    moves = data.moves;
                }

                // convert moves
                pokemon.moves = [];
                for (var i = 0; i < moves.length; i++){
                    let newMove = await pokeApiRequest(moves[i].move.url);
                    newMove.data.text = getText(newMove.data);
                    pokemon.moves.push(newMove.data);
                }
                
                //get random ability
                let abilities = [];
                if (data.abilities.length > 1){
                    let abilityIdx = Math.floor(data.abilities.length * Math.random()); 
                    abilities = [data.abilities[abilityIdx]];
                } else {
                    abilities = data.abilities;
                }

                //convert abilities
                pokemon.abilities = [];
                for (var i = 0; i < abilities.length; i++){
                    let newAbility = await pokeApiRequest(abilities[i].ability.url);
                    newAbility.data.text = getText(newAbility.data);
                    pokemon.abilities.push(newAbility.data);
                }

                //get types
                pokemon.types = [];
                data.types.forEach(t=>{
                    pokemon.types.push(t.type.name);
                })

                pokemon.id = data.id;
                pokemon.name = data.name.toUpperCase();
                pokemon.hp = getStat(data.stats, "hp").base_stat;
                pokemon.currentHP = getStat(data.stats, "hp").base_stat;
                pokemon.spd = getStat(data.stats, "speed").base_stat;
                pokemon.def = getStat(data.stats, "defense").base_stat;
                pokemon.atk = getStat(data.stats, "attack").base_stat;
                pokemon.spcAtk = getStat(data.stats, "special-attack").base_stat;
                pokemon.spcDef = getStat(data.stats, "special-defense").base_stat;
                pokemon.lvl = 1;
                pokemon.xp = 0;
                pokemon.ogg = `./assets/sound/${pokemon.id}.ogg`;
                pokemon.mp3 = `./assets/sound/${pokemon.id}.mp3`;
                
                return pokemon;
            }

            let address = pokeApiHost + "/api/v2/pokemon/" + req.params.pokeId + '/';
            pokeApiRequest(address, async function (data) {
                if (data.error) {
                    return res.json({ error: data.error })
                } else {
                    let newPokemon = await generateNewPokemon(data.data);
                    return res.json({ data: newPokemon })
                }
            })
        },
        getMoveAbility: function (req, res) {
            pokeApiRequest(req.body.url, function (data) {
                if (data.error) {
                    return res.json({ error: data.error })
                } else {
                    return res.json({ data: data.data })
                }
            })
        },
        cachePokemon: function (req, res) {
            var newPokemon = new PokemonTemplate({ pokeId: req.body.id, data: req.body });
            newPokemon.save(function (err, cachePokemon) {
                if (err) {
                    return res.json({ error: err })
                } else {
                    return res.json({ success: true, data: cachePokemon })
                }
            })
        }
    }
})()