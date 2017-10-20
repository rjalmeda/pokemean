var mongoose = require('mongoose');
var Map = mongoose.model('Map');
var World = mongoose.model('World');
module.exports = (function(){
    return {
        saveMap: function(req,res){
            Map.findOne({mapCoordinates: req.body.mapCoordinates}, function(err, map){
                if(err){
                    console.log("err");
                    return res.json({errors: err})
                } else if (map){
                    console.log("found map");
                    map.set(req.body);
                    map.save(function(err1, updatedMap){
                        return res.json({error: err1, map: updatedMap})
                    })
                } else if (!map){
                    console.log("making new map");
                    var newMap = new Map(req.body);
                    newMap.save(function(err2, savedMap){
                        if(err2){
                            console.log("err2");
                            return res.json({errors: err2})
                        } else {
                            console.log("new Map")
                            return res.json({map: savedMap})
                        }
                    })
                }
            })
            
        },
        deleteMap: function(req,res){
            Map.remove({mapCoordinates: req.params.mapCoord}, function(err, results){
                if(err){
                    console.log(err);
                    return res.json({errors: err})
                } else{
                    console.log("Map Deleted");
                    return res.json({results: results})
                }
            });
        },
        fetchMap: function(req,res){
            Map.findOne({mapCoordinates: req.params.mapCoord}, function(err, map){
                if(err){
                    return res.json({errors: err})
                } else {
                    console.log(map);
                    return res.json({map: map})
                }
            })
        },
        saveWorld: function(req,res){
            return res.json({success:"Route works!"})
        }
 }
})();