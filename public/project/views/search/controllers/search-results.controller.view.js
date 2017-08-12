(function () {
    angular.module('FoodLover')
        .controller('SearchResultsController', SearchResultsController);

    function SearchResultsController(FoursquareSearchService, UserService, $routeParams, $location, loggedIn, $mdDialog) {
        var vm = this;
        vm.id = $routeParams['id'];
        vm.name = $routeParams['name'];
        vm.city = $routeParams['city'];
        if (loggedIn) {
            vm.userId = loggedIn._id;
        }

        vm.getRestaurantDetails = getRestaurantDetails;
        vm.logout = logout;

        function init() {

            if (vm.userId) {
                UserService.findUserById(vm.userId)
                    .then(function (response) {
                        vm.user = response.data;
                        user = vm.user;
                    });
            }


            FoursquareSearchService
                .findRestaurantsByPlaceAndCity(vm.name, vm.city)
                .then(function (response) {
                    console.log(response.data);
                    vm.results = response.data.response.groups[0].items;
                    if (typeof vm.results === 'undefined' || vm.results.length === 0) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title("Sorry")
                                .textContent("No results found! Please increase the scope of your search")
                                .ok("OK"));
                        // vm.results=null;
                    }
                }, function (err) {
                    console.log(err);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title("Sorry")
                            .textContent("No results found! Please increase the scope of your search")
                            .ok("OK"));
                });

        }

        init();

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/');
                });
        }

        function getRestaurantDetails(id) {
            if (vm.userId) {
                $location.url('/details/' + id + "/user/");
            } else {
                $location.url('/details/' + id);
            }
        }


    }
})();