(function () {
    angular
        .module('FoodLover')
        .controller('loginController', LoginController);

    function LoginController($mdDialog, $location, UserService) {
        var vm = this;

        vm.login = login;

        function login(user) {
            UserService
                .login(user)
                .then(function (user) {
                        if (user) {
                            $location.url('/');
                        }
                    },
                    function () {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title("Credentials Error!")
                                .textContent("Wrong or incomplete credentials :(")
                                .ok("OK"));

                    }
                );

        }
    }
})();