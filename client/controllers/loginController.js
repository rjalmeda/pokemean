app.controller('loginController', function($scope, $location, loginFactory){
    $scope.login = function(){
        if(!$scope.user){
            return alert('Please input a username');
        } else if (!$scope.user.username) {
            return alert('Please input a username');
        } else if ($scope.user.username.length < 5){
            return alert('Username is too short');
        } else if (!$scope.user.password){
            return alert('Password is empty');
        } else if ($scope.user.password.length < 6){
            return alert('Password is too short');
        } else {
            loginFactory.login($scope.user, function(data){
                currentPlayer = data.data.user

                $scope.user = {};
                if (!data.data.user){
                    return alert(data.data.message);
                };
                if (data.data.user.eggs.length > 0){
                    $location.url('/splash');
                } else if (data.data.user) {
                    $location.url('/world');
                } else {
                    return alert('what happened?');
                };
            })
        }
    };
    $scope.testGapi = function(){
        console.log(gapi);
    };
    $scope.loginGoogle = function(){
        gapi.load('auth2', function(){
            gapi.auth2.init({
                client_id: "607698998219-4obpbit7ekuv38iauqvk7pmqujvdoiq9.apps.googleusercontent.com",
                scope: "profile email"
            }).then(function(GoogleAuth){
                if (!GoogleAuth.isSignedIn.get()){
                    GoogleAuth.signIn();
                } else {
//                    console.log(GoogleAuth);
                    var GoogleUser = GoogleAuth.currentUser.get();
//                    console.log(GoogleUser);
                    var profile = GoogleUser.getBasicProfile();
                    console.log(profile);
                    var userId = GoogleUser.getId();
                    console.log(userId);
                    var profileId = profile.getId();
                    console.log(profileId);
                    var email = profile.getEmail();
                    console.log(email);
                    var username = profile.getName();
//                    console.log(username);
                    $scope.user.googleUsername = username;
                    console.log($scope.user);
                }
                
            }, function(error){
                console.log(error);
            })
        })
    };
    $scope.logoutGoogle = function(){
        console.log(gapi.auth2.getAuthInstance());
    }
});