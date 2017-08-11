module.exports = function () {

    var model = {};
    var mongoose = require('mongoose');
    var RestaurantSchema = require('./restaurant.schema.server')();
    var RestaurantModel = mongoose.model('restaurantModel', RestaurantSchema);

    var api = {
        "placeOrder": placeOrder,
        "setModel": setModel,
        "findOrderByBillId": findOrderByBillId,
        "findOrderByUserId": findOrderByUserId,
        "findAllOrders": findAllOrders,
        "removeOrder": removeOrder
    };

    return api;

    function removeOrder(order) {
        return RestaurantModel.remove({'_id': order._id});
    }

    function findAllOrders() {
        return RestaurantModel.find();
    }

    function findOrderByUserId(userId) {
        return RestaurantModel.find({'userId': userId});
    }

    function findOrderByBillId(billId) {
        return RestaurantModel.findById(billId);
    }

    function setModel(_model) {
        model = _model;
    }

    function placeOrder(newOrder) {

        var total = 0;

        return RestaurantModel
            .create(newOrder)
            .then(function (order) {
                for (var o in order.order[0]) {

                    total += parseFloat(order.order[0][o].price);
                }
                order.total = total.toFixed(2);
                return order.save();
            });
    }


}
