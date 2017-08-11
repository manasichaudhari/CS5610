(function () {
    angular
        .module('FoodLover')
        .controller('homeController', HomeController);

    function HomeController($mdDialog, $location, UserService) {
        var vm = this;
        var user = {};
        function init() {
            UserService
                .findCurrentLoggedInUser()
                .then(function (response) {
                    vm.userId = response.data._id;
                    vm.user = response.data;
                    user = vm.user;
                })
        }

        init();

        vm.Profile = Profile;
        vm.logout = logout;
        vm.searchPlace = searchPlace;
        vm.getPizza = getPizza;
        vm.getBurger = getBurger;
        vm.getDrinks = getDrinks;
        vm.getCoffee = getCoffee;


        function searchPlace(place,city) {
            if(typeof place === 'undefined' || place === "") {
                place="Best Places";
            }
            if (typeof city === 'undefined' || city === "") {
                city = "Seattle"
            }
            if(city) {
                city = city.split(',')[0];
            }
                if (vm.userId) {
                    $location.url('/searchResults/' + place + '/location/' + city + "/user/" + vm.userId);
                } else {
                    $location.url('/searchResults/' + place + '/location/' + city);
                }

        }

        function getPizza() {
            var place = "Pizza";
            var city;
            if (!city) {
                    city = "Seattle";
            }

            if (vm.userId) {
                $location.url('/searchResults/' + place + '/location/' + city + "/user/" + vm.userId);
            } else {
                $location.url('/searchResults/' + place + '/location/' + city);
            }
        }

        function getBurger() {
            var place = "Burger";
            var city;
            if (!city) {
                city = "Seattle";
            }

            if (vm.userId) {
                $location.url('/searchResults/' + place + '/location/' + city + "/user/" + vm.userId);
            } else {
                $location.url('/searchResults/' + place + '/location/' + city);
            }
        }

        function getDrinks() {
            var place = "Bar";
            var city;
            if (!city) {
                    city = "Seattle";
            }

            if (vm.userId) {
                $location.url('/searchResults/' + place + '/location/' + city + "/user/" + vm.userId);
            } else {
                $location.url('/searchResults/' + place + '/location/' + city);
            }
        }

        function getCoffee() {
            var place = "Coffee";
            var city;
            if (!city) {
                    city = "Seattle";
            }

            if (vm.userId) {
                $location.url('/searchResults/' + place + '/location/' + city + "/user/" + vm.userId);
            } else {
                $location.url('/searchResults/' + place + '/location/' + city);
            }
        }


        function Profile() {
            $location.url('user/' + vm.userId);
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/');
                    location.reload();

                },function (err) {
                    $location.url('/');
                    location.reload();
                });
        }
    }
})();