module.exports = function () {

    var model = {};
    var mongoose = require('mongoose');
    var ReviewSchema = require('./review.schema.server')();
    var ReviewModel = mongoose.model('reviewModel', ReviewSchema);

    var api = {
        'setModel': setModel,
        'addReview': addReview,
        'findReviewsForRestaurant': findReviewsForRestaurant,
        'findAllReviewsByUser': findAllReviewsByUser,
        "findAllReviews": findAllReviews,
        "removeReview": removeReview,
        "removeReviewByUser": removeReviewByUser,
        "deleteReview": deleteReview,
    }

    return api;

    function deleteReview(review) {
        return ReviewModel.remove({'_id': review});
    }

    function removeReviewByUser(username) {
        return ReviewModel.remove({'username': username});
    }

    function removeReview(review) {
        return ReviewModel.remove({'_id': review._id});
    }

    function findAllReviews() {
        return ReviewModel.find();
    }

    function findAllReviewsByUser(username) {
        return ReviewModel.find({'username': username});
    }

    function findReviewsForRestaurant(restName) {
        return ReviewModel.find({'restaurantName': restName});
    }

    function addReview(username, restName, review) {
        return ReviewModel.create({'username': username, 'restaurantName': restName, 'review': review.text});
    }

    function setModel(_model) {
        model = _model;
    }

}
