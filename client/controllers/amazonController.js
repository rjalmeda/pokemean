app.controller('amazonController', function($scope, $location, $routeParams, amazonFactory){
    $scope.searchItem = function(){
        var query = {
          actor: 'Samuel L. Jackson',
          searchIndex: 'DVD',
          audienceRating: 'R',
//          ItemPage: "5",
//            responseGroup: 'ItemAttributes,Offers,Images,Small,OfferFull,OfferSummary'
          responseGroup: 'Images'
        }
        amazonFactory.searchForItems(query, function(data){
            console.log(data);
        })
        $scope.item = {};
    }
})