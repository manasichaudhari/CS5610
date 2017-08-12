(function () {
    angular
        .module('FoodLover')
        .controller('registerController', RegisterController);

    function RegisterController(UserService, $mdDialog, $location) {
        var vm = this;
        vm.register = register;

        function register(user) {

            if (user == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Error!")
                        .textContent("Please enter the required fields")
                        .ok("OK"));
            } else if (user.username == null) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Error!")
                        .textContent("Please enter username")
                        .ok("OK"));
            } else if (user.password == null || user.verifyPassword == null) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Error!")
                        .textContent("Please fill password fields")
                        .ok("OK"));

            } else if (user.password != user.verifyPassword) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title("Error!")
                        .textContent("Passwords do not match")
                        .ok("OK"));
            } else {

                UserService.findUserByUsername(user.username)
                    .then(function (response) {
                        if (!response.data) {
                            UserService
                                .registerUser(user)
                                .then(function (response) {
                                    var user = response.data;
                                    $location.url('/user/');
                                });
                        } else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title("Error!")
                                    .textContent("Sorry username already taken.")
                                    .ok("OK"));
                        }

                    }, function (err) {

                    })


            }
        }
    }

})();
