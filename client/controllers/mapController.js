app.controller('mapController', function ($scope, $location, mapFactory) {
    $scope.printScreen = {};
    $scope.currentRegion = {
        name: "kanto"
    };
    $scope.generateCSS = function () {
        console.log("generating");
        $scope.printScreen.text = "Generating new css";

        function spliceImage(width, height, cellWidth, cellHeight) {
            var cellColumns = Math.floor(width / cellWidth);
            var cellRows = Math.floor(height / cellHeight);
            for (var i = 0; i < cellColumns; i++) {
                for (var k = 0; k < cellRows; k++) {
                    var xDigits = width.toString().length;
                    var yDigits = width.toString().length;
                    var xCordinate = i * cellWidth;
                    var yCordinate = k * cellHeight;
                    if (xCordinate.toString().length < xDigits) {
                        var temp = "";
                        for (var x = 0; x < (xDigits - xCordinate.toString().length); x++) {
                            temp += "0";
                        }
                        for (x = 0; x < xCordinate.toString().length; x++) {
                            temp += xCordinate.toString()[x];
                        }
                        xCordinate = temp;
                    } else {
                        xCordinate = xCordinate.toString();
                    }
                    if (yCordinate.toString().length < yDigits) {
                        temp = "";
                        for (x = 0; x < (yDigits - yCordinate.toString().length); x++) {
                            temp += "0";
                        }
                        for (x = 0; x < yCordinate.toString().length; x++) {
                            temp += yCordinate.toString()[x];
                        }
                        yCordinate = temp;
                    } else {
                        yCordinate = xCordinate.toString();
                    };
                    var divName = xCordinate + yCordinate;
                    console.log(divName);
                    console.log(xCordinate);
                    console.log(yCordinate);
                }
            }
        };
        spliceImage(400, 400, 40, 40);
    };
    $scope.imageRef = {
        "width": "258",
        "height": "20834",
        "cellWidth": "32",
        "cellHeight": "32"
    };
    $scope.tileSet = [];
    $scope.tileColumns = 1;
    $scope.tileColumnsReady = false;
    $scope.splitImage = function () {
        if (!$scope.imageRef.width || typeof Number($scope.imageRef.width) == "NaN") {
            return console.log("Invalid Width Input");
        } else if (!$scope.imageRef.height || typeof Number($scope.imageRef.height) == "NaN") {
            return console.log("Invalid Height Input");
        } else if (!$scope.imageRef.cellWidth || typeof Number($scope.imageRef.cellWidth) == "NaN") {
            return console.log("Invalid Cell Width Input")
        } else if (!$scope.imageRef.cellHeight || typeof Number($scope.imageRef.cellHeight) == "NaN") {
            return console.log("Invalid Cell Height Input");
        } else {
            var width = Number($scope.imageRef.width),
                height = Number($scope.imageRef.height),
                cellHeight = Number($scope.imageRef.cellHeight),
                cellWidth = Number($scope.imageRef.cellWidth),
                cellColumns = Math.floor(width/ cellWidth),
                cellRows = Math.floor(height / cellHeight);
            $scope.tileColumns = cellColumns;
            $scope.tileColumnsReady = true;
//            console.log(cellColumns);
//            console.log(cellRows);
            var cellNames = [];
            var rowNames = [];
            var columnNames = [];
            var cssArr = [];
            for (var i = 0; i < cellRows; i++) {
                var rowName = (i * cellHeight) + 1;
                for (var k = 0; k < cellColumns; k++) {
                    var columnName  = (k * cellWidth) + 1;
                    var backgroundPosition = `-${columnName}px -${rowName}px`;
                    var cssString =
`
.tile-R${rowName}-C${columnName} {
    background: url(/assets/pics/tileset5.png);
    background-position: ${backgroundPosition};
    width: ${cellWidth}px;
    height: ${cellHeight}px;
}
`
                    cssArr.push(cssString);
                    var classString = `tile-R${rowName}-C${columnName}`
                    $scope.tileSet.push(classString);
                }
            };
            var cssText = cssArr.join(" ");
            $scope.printScreen.text = cssText;
//            console.log("cssText");
//            console.log(cssText);
//            console.log("Tile Set");
//            console.log($scope.tileSet);
        }
    };
    $scope.splitImage();
    $scope.print = function(text){
        console.log(text);
    };
    $scope.testMap = function(){
        console.log(maps[0][0].map);
    };
    $scope.rawMap = [];
    $scope.copyClass = "";
    $scope.copyTile = function(tile){
        $scope.copyClass = tile;
    };
    $scope.toggleTile = "FG";
    $scope.toggleFGBG = function(){
        if ($scope.toggleTile == "BG"){
            $scope.toggleTile = "MG";
        } else if ($scope.toggleTile == "MG"){
            $scope.toggleTile = "MG2";
        } else if ($scope.toggleTile == "MG2"){
            $scope.toggleTile = "FG";
        } else if ($scope.toggleTile == "FG"){
            $scope.toggleTile = "FG2";
        } else {
            $scope.toggleTile = "BG"
        };
    };
    $scope.pasteTile = function(idx){
        $scope.backupMap();
//        console.log($scope.copyClass);
        if($scope.copyClass == "U" && $scope.rawMap[idx].unpassable){
            $scope.rawMap[idx].unpassable = false;
        } else if ($scope.copyClass == "PL"){
            console.log(idx);
            $scope.currentMap.playerLocation.y = Math.floor(idx / 20)*32;
            $scope.currentMap.playerLocation.x = (idx%20) * 32;
        } else if ($scope.copyClass == "U"){
            $scope.rawMap[idx].unpassable = true;
        } else if ($scope.copyClass == "D" && $scope.rawMap[idx].door){
            $scope.rawMap[idx].door = false
        } else if ($scope.copyClass == "D"){
            $scope.rawMap[idx].door = true;
        } else if ($scope.copyClass == "P" && $scope.rawMap[idx].path){
            $scope.rawMap[idx].path = false
        } else if ($scope.copyClass == "P"){
            $scope.rawMap[idx].path = true
        } else if ($scope.copyClass == "E" && $scope.rawMap[idx].encounter){
            $scope.rawMap[idx].encounter = false
        } else if ($scope.copyClass == "E"){
            $scope.rawMap[idx].encounter = true
        } else if ($scope.toggleTile == "FG"){
            $scope.rawMap[idx].FG = $scope.copyClass;
        } else if ($scope.toggleTile == "FG2"){
            $scope.rawMap[idx].FG2 = $scope.copyClass;
        } else if ($scope.toggleTile == "MG"){
            $scope.rawMap[idx].MG = $scope.copyClass;
        } else if ($scope.toggleTile == "MG2"){
            $scope.rawMap[idx].MG2 = $scope.copyClass;
        } else if ($scope.toggleTile == "BG"){
            $scope.rawMap[idx].BG = $scope.copyClass;
        }
        $scope.clearRedo();
        $scope.checkPathsDoors();
    };
    $scope.compileMap = function(){
        var mapTemp = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
        var unsortedMap = $scope.rawMap.slice();
        unsortedMap.reverse();
        for (var i = 0; i < 15; i++){
            for( var k = 0; k < 20; k++){
                mapTemp[i][k] = unsortedMap.pop();
            }
        };
        console.log(mapTemp);
        return mapTemp;
    };
    $scope.copyPath = function(){
        $scope.copyClass = "P";
        console.log($scope.copyClass);
    };
    $scope.copyUnpassable = function(){
        $scope.copyClass = "U";
        console.log($scope.copyClass);
    };
    $scope.copyDoor = function(){
        $scope.copyClass = "D";
    };
    $scope.copyEncounter = function(){
        $scope.copyClass = "E";
    };
    $scope.copyPlayer = function(){
        $scope.copyClass = "PL";
        console.log("copy player")
    };
    $scope.eraseClass = function(){
        $scope.copyClass = "";
    };
    $scope.mapHistory = [];
    $scope.clearHistory = function(){
        $scope.mapHistory = [];
    };
    $scope.mapRedoHistory = [];
    $scope.backupMap = function(){
        var tempMap = [];
//        console.log($scope.rawMap);
        for (var i = 0; i < $scope.rawMap.length; i++){
            var tempData = Object.assign({}, $scope.rawMap[i]);
            tempMap.push(tempData);
        };
        $scope.mapHistory.push(tempMap);
    };
    $scope.undoMap = function(){
        if($scope.mapHistory.length == 0){
            return console.log("nothing left to undo");
        }
        console.log("undo");
        var tempMap = [];
        for (var i = 0; i < $scope.rawMap.length; i++){
            var tempData = Object.assign({}, $scope.rawMap[i]);
            tempMap.push(tempData);
        };
        $scope.mapRedoHistory.push(tempMap);
        console.log(tempMap);
        $scope.rawMap = $scope.mapHistory.pop();
        $scope.checkPathsDoors();
    };
    $scope.redoMap = function(){
        if($scope.mapRedoHistory.length == 0){
            return console.log("nothing left to redo");
        };
        $scope.backupMap();
        console.log($scope.mapRedoHistory);
        $scope.rawMap = $scope.mapRedoHistory.pop();
        $scope.checkPathsDoors();
    };
    $scope.clearRedo = function(){
        $scope.mapRedoHistory = [];
    };
    $scope.bucketMap = function(){
        console.log("Bucket");
        $scope.backupMap();
        $scope.clearRedo();
        if($scope.copyClass == "P"){
            for(var i = 0; i < $scope.rawMap.length; i++){
                $scope.rawMap[i].path = true;
            }
        } else if ($scope.copyClass =="U"){
            for(var i = 0; i < $scope.rawMap.length; i++){
                $scope.rawMap[i].unpassable = true;
            }
        } else if ($scope.toggleTile == "FG"){
            for(var i = 0; i < $scope.rawMap.length; i++){
                $scope.rawMap[i].FG = $scope.copyClass;
            }
        } else if ($scope.toggleTile == "BG"){
            for(var i = 0; i < $scope.rawMap.length; i++){
                $scope.rawMap[i].BG = $scope.copyClass;
            }
        } else if ($scope.toggleTile == "MG"){
            for(var i = 0; i < $scope.rawMap.length; i++){
                $scope.rawMap[i].MG = $scope.copyClass;
            }
        }
    };
    
    $scope.currentMap = {
        x: 20,
        y: 20
    };
    
    $scope.saveMap = function(){
        $scope.currentMap.map.raw = $scope.rawMap;
        $scope.currentMap.map.compiled = $scope.compileMap();
        var PDs = $scope.processPDs();
        console.log(PDs);
        console.log($scope.currentMap);
        $scope.currentMap.doors = PDs.doors;
        $scope.currentMap.paths = PDs.paths;
        console.log($scope.currentMap);
        mapFactory.saveMap($scope.currentMap, function(data){
            console.log(data);
            $scope.currentMap = data.data.map;
            $scope.rawMap = $scope.currentMap.map.raw;
        });
    };
    $scope.confirmMapDelete = false;
    
    $scope.toggleDelete = function(){
        $scope.confirmMapDelete = !$scope.confirmMapDelete;
    };
    
    $scope.deleteMap = function(){
        console.log('deleting');
        $scope.backupMap();
        mapFactory.deleteMap($scope.currentMap.mapCoordinates, function(data){
            console.log(data);
        })
    };
    
    $scope.buildingName = "";
    
    $scope.updateCoordinates = function(callback){
        $scope.currentMap.mapCoordinates = "" + $scope.currentMap.x + "," + $scope.currentMap.y;
        if($scope.buildingName != ""){
            $scope.currentMap.mapCoordinates = $scope.currentMap.mapCoordinates + "," + $scope.buildingName;
        };
        console.log($scope.currentMap.mapCoordinates);
        if(callback){
            callback();
        };
    };
    $scope.fetchMap = function(callback){
        $scope.updateCoordinates(function(){
//            console.log("Fetching");
            mapFactory.fetchMap($scope.currentMap.mapCoordinates, function(data){
//                console.log(data);
                $scope.currentMap = data;
                $scope.rawMap = data.map.raw;
                $scope.checkPathsDoors();
                $scope.clearRedo();
                $scope.clearHistory();
                if(callback){
                    callback();
                };
            })
        });
    };
    $scope.showCurrentMap = function(){
        console.log($scope.currentMap);
    };
    $scope.fetchMap();
    $scope.doors = [];
    $scope.paths = [];
    $scope.checkPathsDoors = function(){
        let doors = [];
        let paths = [];
        for (var i = 0; i < $scope.rawMap.length; i++){
            if($scope.rawMap[i].door == true){
                var datapoint = {
                    x: (i)%20,
                    y: Math.floor((i+1)/20)
                };
                datapoint.name = "" + datapoint.x + "-" + datapoint.y;
                if($scope.currentMap.doors && datapoint.name in $scope.currentMap.doors){
                    var tempName = datapoint.name;
                    datapoint = $scope.currentMap.doors[datapoint.name];
                    datapoint.name = tempName;
                };
                doors.push(datapoint);
            };
            if($scope.rawMap[i].path == true){
                var datapoint = {
                    x: (i)%20,
                    y: Math.floor((i+1)/20)
                };
                datapoint.name = "" + datapoint.x + "-" + datapoint.y;
                if($scope.currentMap.paths && datapoint.name in $scope.currentMap.paths){
                    var tempName = datapoint.name;
                    datapoint = $scope.currentMap.paths[datapoint.name];
                    datapoint.name = tempName;
                    console.log(datapoint);
                };
                paths.push(datapoint);
            };
        };
        
        $scope.doors = doors;
        $scope.paths = paths;
    };
    $scope.processPDs = function(){
        console.log("Processing PDs");
        var doors = {};
        var paths = {};
        for(var i = 0; i < $scope.doors.length; i++){
            var doorItem = $scope.doors[i];
            doors[doorItem.name] = {
                mapX: doorItem.mapX,
                mapY: doorItem.mapY,
                building: doorItem.building,
                playerX: doorItem.playerX,
                playerY: doorItem.playerY,
                mapSet: doorItem.mapSet
            };
        };
        for(var i = 0; i < $scope.paths.length; i++){
            var pathItem = $scope.paths[i];
            paths[pathItem.name] = {
                mapX: pathItem.mapX,
                mapY: pathItem.mapY,
                playerX: pathItem.playerX,
                playerY: pathItem.playerY,
                mapSet: pathItem.mapSet
            };
        };
        var data = {
            doors: doors,
            paths: paths
        }
        return data;
    };
    $scope.tileBorder = "tileBorder";
    $scope.toggleTileBorders = function(){
        if($scope.tileBorder == "tileBorder"){
            $scope.tileBorder = "";
        } else {
            $scope.tileBorder = "tileBorder";
        }
    };
    $scope.playerFacingValues = ["up", "down", "left", "right"];
});

//sample world object:
//var sampleRegion = 
//    {
//        region: "Kanto",
//        worldMap: [
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            [],
//            []
//        ],
//        worldMusic: ""
//    }
