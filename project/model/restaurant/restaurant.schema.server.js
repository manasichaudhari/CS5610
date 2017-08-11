module.exports = function () {

    var mongoose = require('mongoose');
    var RestaurantSchema = mongoose.Schema({
        'name': String,
        'phone': String,
        'userId': {type: String, default: ''},
        'restId': String,
        'restName': String,
        'order': [],
        'total': {type: Number, default: 0}
    }, {'collection': 'project_restaurant'});

    return RestaurantSchema;
}