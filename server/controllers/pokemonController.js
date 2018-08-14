const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const bcrypt = require('bcryptjs');
const Pokemon = mongoose.model('Pokemon');
const fastPokeCache = new (require('node-cache'))({ stdTTL: 120, checkperiod: 140 });
const slowPokeCache = mongoose.model('PokemonCache');
const PokemonTemplate = mongoose.model('PokemonTemplate');
const https = require('https');
const http = require('http');
const pokeApiHost = "https://pokeapi.co";

function pokeApiRequest(url, callback){
    console.log("poke request");
    
    let cacheData = fastPokeCache.get(url);
    if (cacheData != undefined){
        console.log("found cached data!");
        console.log(cacheData);
        return cacheData;
    };
    
    slowPokeCache.findOne({url: url}, function(err, pokeRecord){
        if(err){
            return callback({error: err})
        } else {
            if(pokeRecord){
                return callback({cached: true, data: pokeRecord.data})
            } else {
                https.get(url, function(resp){
                    var data = "";

                    resp.on('data', function(chunk){
                        data += chunk;
                    });

                    resp.on('end', function(){
                        var parsed = JSON.parse(data);
                        var cacheSaveResult = fastPokeCache.set(url, data);
                        var newRecord = new slowPokeCache({url: url, data: parsed});
                        newRecord.save().then(function(recordData){
                            console.log("record saved");
                            return callback({cached: false, data: parsed})
                        });
                    });
                }).on('error', function(error){
                    console.log(error);
                    return callback({error: error})
                })
            }
        }
    })
    
};


module.exports = (function(){
    return {
        getNewPokemon: function(req,res){
            PokemonTemplate.findOne({pokeId: req.params.pokeId}, function(err, pokemon){
                if(err){
                    return res.json({error: err})
                } else if(pokemon){
                    return res.json({cached: true, data: pokemon})
                } else {
                    var address = pokeApiHost + "/api/v2/pokemon/" + req.params.pokeId + '/';
                    console.log(req.params);
                    console.log("address ", address);
                    pokeApiRequest(address, function(data){
                        if(data.error){
                            console.log("dataError", data.error);
                            return res.json({error: data.error})
                        } else {
                            console.log("got data");
                            console.log(data);
                            return res.json({cached: false, data: data.data})
                        }
                    })
                }
            })
            
        },
        getMove: function(req,res){
            pokeApiRequest(req.body.url, function(data){
                if(data.error){
                    return res.json({error: data.error})
                } else {
                    return res.json({data: data.data})
                }
            })
        },
        cachePokemon: function(req,res){
            var newPokemon = new PokemonTemplate({pokeId: req.body.id, data: req.body});
            newPokemon.save(function(err, cachePokemon){
                if(err){
                    return res.json({error: err})
                } else {
                    console.log("cached pokemon saved");
                    console.log("pokeId: " + req.body.id);
                    console.log(cachePokemon);
                    return res.json({success: true, data: cachePokemon})
                }
            })
        }
    }
})()