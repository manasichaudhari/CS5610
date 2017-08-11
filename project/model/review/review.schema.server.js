module.exports = function () {
    var mongoose = require('mongoose');
    var ReviewSchema = mongoose.Schema({
        username: String,
        restaurantId: String,
        restaurantName: String,
        review: String
    }, {collection: 'project_review'});

    return ReviewSchema;
}
