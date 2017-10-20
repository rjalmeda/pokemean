app.factory('mapFactory', function($http){
    
//    pokeMap constructor
    function PokeMap(mapX, mapY){
        this.map = {
            raw: [],
            compiled: []
        };
        this.playerLocation = {
            x: 1*32,
            y: 1*32,
            facing: "down"
        };
        this.music = "";
        this.type = "outside";
        this.doors = {};
        this.paths = {};
        this.pokemon = {
            common: [],
            uncommon: [],
            rare: []
        };
        this.x = mapX;
        this.y = mapY;
        this.encounterRate = 0.10;
        this.mapCoordinates = "";
        this.init = function(){
            var xCoord = "",
                yCoord = "";
            for(var i = 0; i < 3 - mapX.length; i++){
                xCoord += "0"
            };
            xCoord += mapX;
            for(var i = 0; i < 3- mapY.length; i++){
                yCoord += "0"
            };
            yCoord += mapY;
            this.mapCoordinates = xCoord + "," + yCoord;
            
            for (var i = 0; i < 20; i++){
                var newRow = [];
                for (var k = 0; k < 15; k++){
                    var newData = {
                        BG: '0',
                        MG: '0',
                        FG: '0',
                        door: false,
                        path: false,
                        unpassable: false,
                        encounter: false
                    };
                    newRow.push(newData);
                    this.map.raw.push(newData);
                }
                this.map.compiled.push(newRow);
            };
        };
        this.init();
    };
    
    
    var factory = {};
    factory.saveMap = function(map, callback){
        $http.post('/saveMap', map).then(function(data){
            callback(data);
        })
    };
    
    factory.deleteMap = function(mapCoord, callback){
        $http.delete('/deleteMap/' + mapCoord).then(function(data){
            if(data.data.errors){
                callback(data.data.errors);
            } else {
                callback(data);
            }
        })
    }
    
    factory.fetchMap = function(mapCoord, callback){
        $http.get('/fetchMap/' + mapCoord).then(function(data){
//            console.log(data);
            if (data.data.errors){
                callback(data.data.errors)
            } else if (data.data.map){
                console.log("found existing map");
                callback(data.data.map);
            } else if (!data.data.map){
                console.log("generating new map");
                var coordinates = mapCoord.split(",");
                var newMap = new PokeMap(Number(coordinates[0]), Number(coordinates[1]));
                callback(newMap);
            } 
        })
    };
    
    return factory;
})