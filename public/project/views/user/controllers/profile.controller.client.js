(function () {
    angular.module('FoodLover')
        .controller('profileController', ProfileController);

    function ProfileController($mdDialog, $location, $http, $routeParams, UserService, ReviewService, FoursquareSearchService, RestaurantService, loggedIn) {
        var vm = this;

        vm.userId = loggedIn._id;

        vm.currentUser = loggedIn;

        var logInUser = {};

        vm.deleteUser = deleteUser;
        vm.removeFavorite = removeFavorite;
        vm.unFollowUser = unFollowUser;
        vm.logout = logout;
        vm.deleteReview = deleteReview;

        function init() {

            if (vm.userId) {
                UserService
                    .findUserById(vm.userId)
                    .then(function (response) {
                        vm.user = response.data;
                        logInUser = response.data;

                        vm.userFollows = [];
                        vm.userFollowedBy = [];

                        // If the user does not follow anyone
                        if (response.data.follows.length == 0) {
                            vm.noFollows = true;
                            vm.alreadyFollows = false;
                        } else {
                            vm.noFollows = false;
                        }

                        // If the user is not followed by anyone
                        if (response.data.followedBy.length == 0) {
                            vm.noFollowedBy = true;
                        } else {
                            vm.noFollowedBy = false;
                        }

                        for (var f in response.data.follows) {
                            UserService.findUserById(response.data.follows[f])
                                .then(function (response) {
                                    vm.userFollows.push(response.data);
                                    vm.alreadyFollows = true;
                                });
                        }

                        for (var f in response.data.followedBy) {
                            UserService.findUserById(response.data.followedBy[f])
                                .then(function (response) {
                                    vm.userFollowedBy.push(response.data);
                                });

                        }
                        ReviewService
                            .findAllReviewsByUser(vm.user.username)
                            .then(function (response) {
                                vm.reviews = response.data;
                            });

                        RestaurantService
                            .findOrderByUserId(vm.userId)
                            .then(function (response) {
                                vm.orders = response.data;
                            });
                    });
            }
        }

        init();

        function deleteReview(review) {
            ReviewService.deleteReview(review)
                .then(function (response) {
                    init();
                })
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/');
                })
        }

        function unFollowUser(user) {
            UserService.unFollowUser(vm.userId, user)
                .then(function (response) {

                    setTimeout(init, 100);
                })
        }

        function removeFavorite(favorite) {
            UserService.deleteFavoriteRestaurant(vm.userId, favorite)
                .then(function (response) {
                    init();
                });
        }

        function deleteUser() {
            var confirm = $mdDialog.confirm()
                .title("Warning!")
                .textContent("Are you sure?")
                .ok("Yes")
                .cancel("No!");

            $mdDialog.show(confirm).then(yes, no);

            function no() {
                $location.url('/user');
            }

            function yes() {
                UserService.deleteUser(vm.userId)
                    .then(function (response) {
                        $location.url('/');
                    }, function (err) {
                        console.log(err);
                    });
            }
        }


    }
})();