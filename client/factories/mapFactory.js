app.factory('mapFactory', function($http){
    
//    pokeMap constructor
    function PokeMap(mapCoord){
        this.map = {
            raw: [],
            compiled: []
        };
        this.playerLocation = {
            x: 5*32,
            y: 5*32,
            facing: "down"
        };
        this.x = 0;
        this.y = 0;
        this.music = "";
        this.type = "outside";
        this.doors = {};
        this.paths = {};
        this.pokemon = {
            common: [],
            uncommon: [],
            rare: []
        };
        this.mapCoordinates = mapCoord;
        this.building = "";
        this.encounterRate = 0.10;
        this.init = function(){
            var coordinates = this.mapCoordinates.split(',');
            this.x = parseInt(coordinates[0]);
            this.y = parseInt(coordinates[1]);
            if(coordinates[2]){
                this.building = coordinates[2];
            };
            for (var i = 0; i < 20; i++){
                var newRow = [];
                for (var k = 0; k < 15; k++){
                    var newData = {
                        BG: '0',
                        MG: '0',
                        MG2: '0',
                        FG: '0',
                        FG2: '0',
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
        console.log(mapCoord);
        $http.get('/fetchMap/' + mapCoord).then(function(data){
//            console.log(data);
            if (data.data.errors){
                callback(data.data.errors)
            } else if (data.data.map){
                console.log("found existing map");
                callback(data.data.map);
            } else if (!data.data.map){
                console.log("generating new map");
                var newMap = new PokeMap(mapCoord);
                console.log(mapCoord);
                console.log(newMap);
                callback(newMap);
            } 
        })
    };
    
    factory.fetchTestID = function(callback){
        var testID = $("#testID")
        callback(testID);
    }

    return factory;
})