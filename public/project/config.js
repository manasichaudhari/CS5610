(function () {
    angular.module('FoodLover')
        .config(Configuration);

    function Configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/templates/home.view.client.html',
                controller: 'homeController',
                controllerAs: 'model'
            })
            .when('/login', {
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: 'loginController',
                controllerAs: 'model'
            })
            .when('/searchResults/:name/location/:city/', {
                templateUrl: 'views/search/templates/search-results.view.client.html',
                controller: 'SearchResultsController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/searchResults/:name/location/:city/user/', {
                templateUrl: 'views/search/templates/search-results.view.client.html',
                controller: 'SearchResultsController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/details/:id', {
                templateUrl: 'views/search/templates/details.view.client.html',
                controller: 'DetailsController',
                controllerAs: 'model'
            })
            .when('/details/:id/user/:uid', {
                templateUrl: 'views/search/templates/details.view.client.html',
                controller: 'DetailsController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/admin', {
                templateUrl: 'views/admin/templates/admin-profile.view.client.html',
                controller: 'adminController',
                controllerAs: 'model',
                resolve: {
                    adminUser: checkAdmin
                }

            })
            .when('/manager', {
                templateUrl: 'views/manager/templates/manager.view.client.html',
                controller: 'managerController',
                controllerAs: 'model',
                resolve: {
                    managerUser: checkManager
                }

            })
            .when('/signup', {
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'registerController',
                controllerAs: 'model'
            })
            .when('/user', {
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/user/:uid', {
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/user/:uid/edit', {
                templateUrl: 'views/user/templates/profile-edit.view.client.html',
                controller: 'profileEditController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/restaurant/:id/order', {
                templateUrl: 'views/restaurant/templates/restaurant.view.client.html',
                controller: 'resturantController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when('/restaurant/:id/bill/:billId', {
                templateUrl: 'views/restaurant/templates/bill.view.client.html',
                controller: 'resturantController',
                controllerAs: 'model',
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })

    }

    function checkLoggedIn(UserService, $q, $location) {
        var deferred = $q.defer();
        UserService
            .loggedIn()
            .then(function (user) {
                if(user === '0') {
                    deferred.resolve(null);
                    // $location.url('/login');
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }

    function noCheckLoggedIn() {

    }

    function checkAdmin(UserService, $q, $location) {
        var deferred = $q.defer();
        UserService.checkAdmin()
            .then(function (response) {
                if (response.data != '0') {
                    deferred.resolve(response.data);

                } else {
                    deferred.reject();
                    $location.url('/user');
                }
            });
        return deferred.promise;
    }

    function checkManager(UserService, $q, $location) {
        var deferred = $q.defer();
        UserService.checkManager()
            .then(function (response) {
                if (response.data != '0') {
                    deferred.resolve(response.data);

                } else {
                    deferred.reject();
                    $location.url('/user');
                }
            });
        return deferred.promise;
    }


})();