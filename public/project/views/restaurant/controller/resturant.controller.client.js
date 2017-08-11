(function () {
    angular.module('FoodLover')
        .controller('resturantController', resturantController);

    function resturantController($routeParams, FoursquareSearchService, UserService, RestaurantService, $location, $mdDialog,loggedIn) {
        var vm = this;
        vm.user=loggedIn;
        vm.restId = $routeParams['id'];
        vm.billId = $routeParams['billId'];
        vm.logout = logout;

        var user = {};
        vm.list = [];
        var restName = {};

        function init() {

            UserService.findCurrentLoggedInUser()
                .then(function (response) {
                    user = response.data;
                    vm.user = user;
                })

            FoursquareSearchService
                .findRestaurantById(vm.restId)
                .then(function (response) {
                    vm.restaurantName = response.data.response.venue.name;
                    restName = response.data.response.venue.name;
                })

            FoursquareSearchService
                .findMenuForRestaurant(vm.restId)
                .then(function (response) {
                    if (response.data.response.menu.menus.count == 0) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title("Menu error!")
                                .textContent("Menu not available")
                                .ok("OK"));
                        $location.url('/details/' + vm.restId + '/user/' + user._id);
                    } else {
                        var menu=response.data.response.menu.menus.items[0].entries.items[0].entries.items;
                        console.log(response.data.response.menu.menus.items[0].entries.items[0].entries.items);
                        for(var i =1;i < response.data.response.menu.menus.items[0].entries.count; i++) {
                            menu = (menu).concat(response.data.response.menu.menus.items[0].entries.items[i].entries.items)
                            ;
                        }
                        vm.menu=menu;
                    console.log(vm.menu);
                    }
                });

            if (vm.billId) {
                RestaurantService
                    .findOrderByBillId(vm.billId)
                    .then(function (response) {
                        vm.bill = response.data;
                    })
            }
        }

        init();
        vm.placeOrder = placeOrder;
        vm.addList = addList;


        function addList(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }

        }
        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/')
                })
        }


        function placeOrder() {
            var order={};
            order.name=vm.user.username;
            order.restName= restName;
            order.restId = vm.restId;
            order.userId = user._id;
            if (vm.list.length == 0) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Empty order!")
                        .textContent("Please select items")
                        .ok("OK"));
            } else if (vm.menu[0].price !== null && typeof vm.menu[0].price !== 'undefined' ) {
                    console.log(vm.menu[0].price);
                    RestaurantService
                        .placeOrder(order, vm.list)
                        .then(function (response) {
                            if (response) {
                                $location.url('/restaurant/' + vm.restId + '/bill/' + response.data._id);
                            }
                        });

            }
            else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Apologies")
                        .textContent("Online order option unavailable, because price is not listed by vendor")
                        .ok("OK"));
            }


        }


    }
})();