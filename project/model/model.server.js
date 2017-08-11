module.exports = function () {

    var userModel = require('./user/user.model.server')();
    var reviewModel = require('./review/review.model.server')();
    var restaurantModel = require('./restaurant/restaurant.model.server')();

    //Getting all the models of all types of views in one variable and returning them to app.
    var models = {
        UserModel: userModel,
        ReviewModel: reviewModel,
        RestaurantModel: restaurantModel
    };

    userModel.setModel(models);
    reviewModel.setModel(models);
    restaurantModel.setModel(models);

    return models;

}