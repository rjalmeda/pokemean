var mongoose = require('mongoose');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var bcrypt = require('bcryptjs');
var Pokemon = mongoose.model('Pokemon');
var PokemonCache = mongoose.model('PokemonCache');
var PokemonTemplate = mongoose.model('PokemonTemplate');
var https = require('https');
var http = require('http');
var pokeApiHost = "https://pokeapi.co";

var pokeApiRequest = function(url, callback){
    console.log("poke request");
    PokemonCache.findOne({url: url}, function(err, pokeRecord){
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
                        var newRecord = new PokemonCache({url: url, data: parsed});
                        newRecord.save(function(err, recordData){
                            if(err){
                                return callback({error: err})
                            } else {
                                console.log("record saved");
                                return callback({cached: false, data: parsed})
                            }
                        })
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
                    pokeApiRequest(address, function(data){
                        if(data.error){
                            return res.json({error: data.error})
                        } else {
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