(function () {
    angular.module('FoodLover')
        .controller('managerController', managerController);

    function managerController(UserService, $location, ReviewService, RestaurantService, $mdDialog,managerUser) {
        var vm = this;
        vm.user=managerUser;
        vm.logout = logout;
        vm.removeOrder = removeOrder;

        function init() {
            UserService
                .findAllUsers()
                .then(function (response) {
                    vm.users = response.data;

                    vm.reviews = [];

                    for (var u in vm.users) {
                        ReviewService.findAllReviewsByUser(vm.users[u].username)
                            .then(function (response) {
                                vm.reviews.push(response.data);
                            });
                    }
                });

            var anonUsername = "Anonymous";

            ReviewService.findAllReviewsByUser(anonUsername)
                .then(function (response) {
                    vm.anonReviews = response.data;
                });

            RestaurantService.findAllOrders()
                .then(function (response) {
                    vm.orders = response.data;
                });
        }

        init();

        function removeOrder(order) {
            RestaurantService.removeOrder(order)
                .then(function (response) {
                    init();
                })
        }


        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/')
                })
        }
    }
})();
