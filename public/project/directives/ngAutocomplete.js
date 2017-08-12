(function () {

    angular.module('FoodLover')
        .directive('ngAutocomplete', function ($parse) {
            // return {
            //     link: function () {
            //         $timeout(function () {
            //             // Find google places div
            //             _.findIndex(angular.element(document.querySelectorAll('.pac-container')), function (container) {
            //                 // disable ionic data tab
            //                 container.setAttribute('data-tap-disabled', 'true');
            //                 // leave input field if google-address-entry is selected
            //                 container.onclick = function () {
            //                     document.getElementById('autocomplete').blur();
            //                 };
            //             });
            //         }, 500);
            //     }
            // }







            return {

                scope: {
                    details: '=',
                    ngAutocomplete: '=',
                    options: '='
                },

                link: function (scope, element, attrs, model) {

                    //options for autocomplete
                    var opts

                    //convert options provided to opts
                    var initOpts = function () {

                        opts = {}
                        if (scope.options) {
                            if (scope.options.types) {
                                opts.types = []
                                opts.types.push(scope.options.types)
                            }
                            if (scope.options.bounds) {
                                opts.bounds = scope.options.bounds
                            }
                            if (scope.options.country) {
                                opts.componentRestrictions = {
                                    country: scope.options.country
                                }
                            }
                        }
                    }
                    initOpts()


                    //create new autocomplete
                    //reinitializes on every change of the options provided
                    var newAutocomplete = function () {
                        scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                        google.maps.event.addListener(scope.gPlace, 'place_changed', function () {




                            scope.$apply(function () {
                                scope.details = scope.gPlace.getPlace();
                                scope.ngAutocomplete = element.val();
                            });
                        })
                    }
                    newAutocomplete()


                    $timeout(function () {
                        // Find google places div
                        _.findIndex(angular.element(document.querySelectorAll('.pac-container')), function (container) {
                            // disable ionic data tab
                            container.setAttribute('data-tap-disabled', 'true');
                            // leave input field if google-address-entry is selected
                            container.onclick = function () {
                                document.getElementById('autocomplete').blur();
                            };
                        });
                    }, 500);


                    //watch options provided to directive
                    scope.watchOptions = function () {
                        return scope.options
                    };
                    scope.$watch(scope.watchOptions, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            initOpts()
                            newAutocomplete()
                            element[0].value = '';
                            scope.ngAutocomplete = element.val();
                        }
                    }, true);
                }
            };
        });
})();