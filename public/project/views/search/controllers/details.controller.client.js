(function () {
    angular.module('FoodLover')
        .controller('DetailsController', DetailsController);

    function DetailsController($mdDialog, FoursquareSearchService, ReviewService, UserService, $location, $routeParams, loggedIn) {
        var vm = this;

        vm.id = $routeParams['id'];
        if (loggedIn) {
            vm.userId = loggedIn._id;
        }

        var user = {};

        vm.addReviews = addReviews;
        vm.addFavoriteRestaurant = addFavoriteRestaurant;
        vm.deleteFavoriteRestaurant = deleteFavoriteRestaurant;
        vm.followUser = followUser;
        vm.unFollowUser = unFollowUser;
        vm.logout = logout;
        vm.deleteReview = deleteReview;

        function init() {

            if (vm.userId) {
                UserService.findUserById(vm.userId)
                    .then(function (response) {
                        user = response.data;

                        vm.loggedInUser = user;
                        vm.username = user.username; //This is for the check so that the logged in person doesn't follow themselves.
                        if (user.favourites.length == 0) {
                            vm.favorite = false;
                        } else {
                            for (var f in user.favourites) {
                                if (vm.id == user.favourites[f].id) {
                                    vm.favorite = true;
                                    break;
                                } else {
                                    vm.favorite = false;
                                }
                            }
                        }
                    });
            }

            FoursquareSearchService
                .findMenuForRestaurant(vm.id)
                .then(function (response) {
                    if (response.data.response.menu.menus.count == 0) {
                        vm.canOrder = false;
                    } else {
                        vm.canOrder = true;
                    }
                });


            FoursquareSearchService
                .findRestaurantById(vm.id)
                .then(function (response) {

                    vm.details = response.data.response.venue;

                    var address = vm.details.name;

                    restName = vm.details.name;

                    ReviewService.findReviewsForRestaurant(vm.details.name)
                        .then(function (response) {
                            vm.reviews = response.data;

                            vm.alreadyFollows = [];
                            for (var r in vm.reviews) {
                                if (vm.reviews[r].username != "Anonymous") {
                                    UserService.findUserByUsername(vm.reviews[r].username)
                                        .then(function (response) {
                                            if (user) {
                                                if (user.follows.length == 0) {
                                                    vm.Follows = false;
                                                } else {
                                                    for (var u in user.follows) {
                                                        if (response.data._id == user.follows[u]) {

                                                            vm.alreadyFollows.push(response.data.username);
                                                        }
                                                    }
                                                }
                                            } else {
                                                vm.Follows = false;
                                            }
                                        });
                                }
                            }
                        })
                }, function (err) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title("Sorry")
                            .textContent("No results found! Please increase the scope of your search")
                            .ok("OK"));

                });

        }

        init();

        var userToFollow = {};

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
                });
        }

        function unFollowUser(username) {
            UserService.findUserByUsername(username)
                .then(function (response) {

                    vm.userToFollow = response.data;
                    userToFollow = vm.userToFollow;

                    UserService.unFollowUser(vm.userId, response.data)
                        .then(function (response) {

                            for (var u in response.data.follows) {
                                if (userToFollow._id != response.data.follows[u]) {
                                    vm.Follows = false;
                                } else {
                                    vm.Follows = true;
                                }
                            }
                        })
                });
            //display follow status correctly
            setTimeout(init, 200);
        }

        function followUser(username) {

            UserService.findUserByUsername(username)
                .then(function (response) {
                    vm.userToFollow = response.data;
                    userToFollow = vm.userToFollow;
                    UserService.followUser(vm.userId, response.data)
                        .then(function (response) {
                            for (var u in response.data.follows) {
                                if (userToFollow._id == response.data.follows[u]) {
                                    vm.Follows = true;
                                } else {
                                    vm.Follows = false;
                                }
                            }
                        })
                });

            setTimeout(init, 200);

        }

        function deleteFavoriteRestaurant(restaurant) {
            UserService
                .deleteFavoriteRestaurant(vm.userId, restaurant)
                .then(function (response) {
                    UserService.findUserById(vm.userId)
                        .then(function (response) {
                            user = response.data;
                            for (var f in user.favourites) {
                                if (restaurant.id != user.favourites[f].id) {
                                    vm.favorite = false;
                                } else {
                                    vm.favorite = true;
                                }
                            }
                        });
                });
            init();
        }

        function addFavoriteRestaurant(restaurant) {

            UserService
                .addFavoriteRestaurant(vm.userId, restaurant)
                .then(function (response) {
                    UserService
                        .findUserById(vm.userId)
                        .then(function (response) {
                            user = response.data;
                            for (var f in user.favourites) {
                                if (restaurant.id == user.favourites[f].id) {
                                    vm.favorite = true;
                                } else {
                                    vm.favorite = false;
                                }
                            }
                        });

                }, function (err) {
                    console.log(err);

                })
        }


        function addReviews(name, review, text) {

            vm.review = "";
            if (vm.userId) {

                if (text !== "" && typeof text !== 'undefined') {
                    ReviewService
                        .addReview(user.username, name, review)
                        .then(function (response) {
                            vm.review = response.data;
                        });
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title("Review error!")
                            .textContent("Can't post an empty review.")
                            .ok("OK"));
                }
            } else {
                if (text !== "" && typeof text !== 'undefined') {
                    var newUser = {'username': "Anonymous"};
                    ReviewService.addReview(newUser.username, name, review)
                        .then(function (response) {
                            vm.review = response.data;
                        });
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title("Review error!")
                            .textContent("Can't post an empty review.")
                            .ok("OK"));

                }
            }
            init();
        }
    }
})();