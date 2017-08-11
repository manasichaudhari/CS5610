(function () {
    angular.module('FoodLover')
        .controller('profileEditController', ProfileEditController);

    function ProfileEditController($location, $routeParams, UserService, $mdDialog) {
        var vm = this;

        vm.userId = $routeParams['uid'];
        vm.logout = logout;
        vm.update = update;

        function init() {
            UserService.findUserById(vm.userId)
                .then(function (response) {
                    vm.user = response.data;
                });
        }
        init();

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $location.url('/')
                })
        }

        function update(newuser) {
            if(newuser.password === null || newuser.password ==="" || typeof newuser.password === 'undefined') {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Update Error!")
                        .textContent("Password is required")
                        .ok("OK"));
            }

            if(newuser.email !== "" && (typeof newuser.email !== 'undefined' &&  !(newuser.email.includes("@")))) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Update Error!")
                        .textContent("Invalid email")
                        .ok("OK"));
            }
            else {
                UserService.updateUser(vm.userId, newuser)
                    .then(function (response) {
                        newuser = response.data;
                        $location.url('user/' + vm.userId);
                    }, function (err) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title("Update Error!")
                                .textContent("Update failed")
                                .ok("OK"));
                    });
            }

        }
    }
})();
