(function () {
    angular
        .module('FoodLover')
        .factory('FoursquareSearchService', FoursquareSearchService);

    function FoursquareSearchService($http) {
        var api = {
            'findRestaurantsByPlaceAndCity': findRestaurantsByPlaceAndCity,
            'findRestaurantById': findRestaurantById,
            'findMenuForRestaurant': findMenuForRestaurant,
            'findImageforRestaurant': findImageforRestaurant
        };

        return api;

        function findMenuForRestaurant(restId) {
            var url = "https://api.foursquare.com/v2/venues/" + restId +
                "/menu?&client_id=NBDNWZNOYVVAMT3SLBA5SWQYHP21SQQ3LYB22OHK2ATAC5TT" +
                "&client_secret=ZW31TL3XJ1VGYXPJI2QTK2MN1I0LJZ1NXWDZI0NSRFAZ2XVM&v=20170812";

            return $http.get(url);
        }

        function findRestaurantById(id) {
            var url = "https://api.foursquare.com/v2/venues/" + id + "?&client_id=NBDNWZNOYVVAMT3SLBA5SWQYHP21SQQ3LYB22OHK2ATAC5TT" +
                "&client_secret=ZW31TL3XJ1VGYXPJI2QTK2MN1I0LJZ1NXWDZI0NSRFAZ2XVM&v=20170812";
            return $http.get(url);
        }

        function findRestaurantsByPlaceAndCity(place, city) {
            var url = "https://api.foursquare.com/v2/venues/explore?TERM&venuePhotos=1&client_id=NBDNWZNOYVVAMT3SLBA5SWQYHP21SQQ3LYB22OHK2ATAC5TT" +
                "&client_secret=ZW31TL3XJ1VGYXPJI2QTK2MN1I0LJZ1NXWDZI0NSRFAZ2XVM&v=20170812";
            var finalUrl = url.replace('TERM', "near=" + city + "&query=" + place);
            return $http.get(finalUrl);
        }


        function findImageforRestaurant(id) {
            var url = "https://api.foursquare.com/v2/venues/" + id + "/photos?&client_id=NBDNWZNOYVVAMT3SLBA5SWQYHP21SQQ3LYB22OHK2ATAC5TT" +
                "&client_secret=ZW31TL3XJ1VGYXPJI2QTK2MN1I0LJZ1NXWDZI0NSRFAZ2XVM&v=20170812";
            return $http.get(url);

        }

    }
})();