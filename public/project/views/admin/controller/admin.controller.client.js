(function () {
    angular.module('FoodLover')
        .controller('adminController', adminController);

    function adminController(UserService, $location, ReviewService, RestaurantService, $mdDialog,adminUser) {
        var vm = this;
        vm.user=adminUser;
        vm.removeUser = removeUser;
        vm.logout = logout;
        vm.removeReview = removeReview;
        vm.removeOrder = removeOrder;
        vm.removeFavorite = removeFavorite;
        vm.makeAdmin = makeAdmin;
        vm.makeManager= makeManager;
        // vm.removeAdmin = removeAdmin;

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


        function makeAdmin(user) {
            UserService
                .makeAdmin(user)
                .then(function (response) {
                    init();

                })

        }

        function makeManager(user) {
            UserService
                .makeManager(user)
                .then(function (response) {
                    init();

                })

        }


        function removeFavorite(user, fav) {
            UserService
                .removeFavorite(user, fav)
                .then(function (response) {
                    init();
                }, function (err) {

                })
        }

        function removeOrder(order) {
            RestaurantService.removeOrder(order)
                .then(function (response) {
                    init();
                })
        }

        function removeReview(review) {
            ReviewService.removeReview(review)
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

        function removeUser(user) {
            UserService.removeUser(user)
                .then(function (response) {
                    init();
                }, function (err) {

                })
        }

    }
})();
