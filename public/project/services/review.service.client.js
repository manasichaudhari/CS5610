(function () {
    angular.module('FoodLover')
        .factory('ReviewService', ReviewService);

    function ReviewService($http) {
        var api = {
            'addReview': addReview,
            'findReviewsForRestaurant': findReviewsForRestaurant,
            'findAllReviewsByUser': findAllReviewsByUser,
            "findAllReviews": findAllReviews,
            "removeReview": removeReview,
            "deleteReview": deleteReview,
        };

        return api;

        function deleteReview(review) {
            return $http.delete('/api/project/user/review/delete/' + review._id);
        }


        function removeReview(review) {
            return $http.put('/api/project/admin/review', review);
        }

        function findAllReviews() {
            return $http.get('/api/project/admin/reviews');
        }

        function findAllReviewsByUser(username) {
            return $http.get('/api/project/review/user/' + username);
        }

        function findReviewsForRestaurant(restName) {
            return $http.get('/api/project/review/' + restName);
        }

        function addReview(username, restName, review) {
            return $http.post('/api/project/review/' + restName + '/user/' + username, review);
        }
    }
})();
