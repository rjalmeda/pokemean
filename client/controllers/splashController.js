app.controller('splashController', function ($scope, $location, loginFactory, pokemonFactory) {
    $scope.newpokemons = [];

    var pokecry = function (id) {

    };

    $scope.loadingComplete = false;

    function getText(data) {
        if (!data.flavor_text_entries) {
            return "";
        } else {
            for (var i = 0; i < data.flavor_text_entries.length; i++) {
                if (data.flavor_text_entries[i].language.name == "en") {
                    return data.flavor_text_entries[i].flavor_text;
                }
            }
            return "";
        }
    }

    function loadTestData() {
        return {
            "eggs": [1]
        }
    }

    function checkUser() {
        loginFactory.checkUser(function (data) {
            console.log(data);
            $scope.user = data.data.user
            if (!$scope.user) {
                $scope.user = loadTestData();
            }

            function popEgg(index) {
                pokemonFactory.getNewPokemon($scope.user.eggs[index], function (data) {
                    console.log("getting pokemon");
                    console.log(data);
                    $scope.newpokemons.push(data.data);
                    pokemonFactory.popEgg(data.data, function (userData) {
                        if (userData.data.user.eggs.length === 0) {
                            $scope.loadingComplete = true;
                        }
                    })
                })
            };

            for (var z = 0; z < $scope.user.eggs.length; z++) {
                popEgg(z);
            }
        });

    };
    checkUser();
})

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})