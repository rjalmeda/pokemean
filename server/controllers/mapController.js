var mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;
var Map = mongoose.model('Map');
var World = mongoose.model('World');
module.exports = (function(){
    return {
        saveMap: function(req,res){
            Map.findOne({mapCoordinates: req.body.mapCoordinates}, function(err, map){
                if(err){
                    return res.json({errors: err})
                } else if (map){
                    map.set(req.body);
                    map.set('doors', req.body.doors);
                    map.set('paths', req.body.paths);
                    map.save(function(err1, updatedMap){
                        console.log(updatedMap.doors)
                        return res.json({error: err1, map: updatedMap})
                    })
                } else if (!map){
                    var newMap = new Map(req.body);
                    newMap.save(function(err2, savedMap){
                        if(err2){
                            return res.json({errors: err2})
                        } else {
                            return res.json({map: savedMap})
                        }
                    })
                }
            })
            
        },
        deleteMap: function(req,res){
            Map.remove({mapCoordinates: req.params.mapCoord}, function(err, results){
                if(err){
                    return res.json({errors: err})
                } else{
                    return res.json({results: results})
                }
            });
        },
        fetchMap: function(req,res){
            Map.findOne({mapCoordinates: req.params.mapCoord}, function(err, map){
                if(err){
                    return res.json({errors: err})
                } else {
                    return res.json({map: map})
                }
            })
        },
        saveWorld: function(req,res){
            return res.json({success:"Route works!"})
        }
 }
})();