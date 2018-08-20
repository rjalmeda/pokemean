app.directive('draggable', function($rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            element.draggable({
                revert: false,
                start: function(event, ui){
                    console.log(ui);
                    scope.incrementOpenProgramZIndex();
                    element.css('z-index', scope.openProgramZIndex);
                },
                stop: function(event, ui){
                    
                }
            })
        }
    }
});

app.directive('droppable', function($compile){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            element.droppable({
                //accept: ".gearboxItem",
                //hoverClass: "drop-hover",
               //drop: function(event, ui){
                //    console.log(this);
                //}
            })
        }
    }
});

app.directive('dblclickflip', function(){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            element.on('dblclick', function(event){
                if(!element.hasClass('flipped')){
                    element.addClass('flipped');
                } else {
                    element.removeClass('flipped');
                }
                
            })
        }
    }
})

app.directive('addTouch', function($rootScope){
    return function(scope, element, attrs){
        scope.addTouch(element);
    }
})