(function () {

    angular.module('FoodLover')
        .directive('ngAutocomplete', function ($parse) {

            return {
                require: 'ngModel',
                link: function (scope, element, attrs, model) {
                    var options = {
                        types: [],
                        componentRestrictions: {}
                    };
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                    google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                        scope.$apply(function () {
                            model.$setViewValue(element.val());
                        });
                    });
                }
            };
        });

    $('body').on('touchstart','.pac-container', function(e){
        e.stopImmediatePropagation();
    })

    function MyCtrl($scope) {
        $scope.gPlace;
    }
})();