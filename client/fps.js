$(document).ready(function(){
//    var stop = false;
//    var frameCount = 0;
//    var $results = $("#results");
//    var fps, fpsInterval, startTime, now, then, elapsed;
//
//
//    // initialize the timer variables and start the animation
//
//    function startAnimating(fps) {
//        fpsInterval = 1000 / fps;
//        then = Date.now();
//        startTime = then;
//        animate();
//    }
//    
//    
//    function animate() {
//
//        // request another frame
//
//        requestAnimationFrame(animate);
//
//        // calc elapsed time since last loop
//
//        now = Date.now();
//        elapsed = now - then;
//
//        // if enough time has elapsed, draw the next frame
//
//        if (elapsed > fpsInterval) {
//
//            // Get ready for next frame by setting then=now, but also adjust for your
//            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
//            then = now - (elapsed % fpsInterval);
//            console.log('drawing rate');
//            // Put your drawing code here
//
//        }
//    }
//    
//    startAnimating(30);
});