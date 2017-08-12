module.exports = function (app, model) {
    app.post('/api/project/restaurant/order', placeOrder);
    app.get('/api/project/restaurant/order/bill/:billId', findOrderByBillId);
    app.get('/api/project/restaurant/order/user/:uid', findOrderByUserId);
    app.get('/api/project/admin/restaurant/order', findAllOrders);
    app.put('/api/project/admin/restaurant/order', removeOrder);

    function removeOrder(req, res) {

        var order = req.body;

        if (req.user && (req.user.roles == "ADMIN" || req.user.roles == "MANAGER")) {
            model.RestaurantModel.removeOrder(order)
                .then(function (order) {
                    res.sendStatus(200);
                }, function (err) {
                    res.sendStatus(500);
                })
        }
    }

    function findAllOrders(req, res) {

        if (req.user && (req.user.roles == "ADMIN" || req.user.roles == "MANAGER")) {
            model.RestaurantModel.findAllOrders()
                .then(function (orders) {
                    res.send(orders);
                }, function (err) {
                    res.sendStatus(404);
                });
        }


    }

    function findOrderByUserId(req, res) {
        var userId = req.params['uid'];

        model.RestaurantModel.findOrderByUserId(userId)
            .then(function (orders) {
                res.send(orders)
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findOrderByBillId(req, res) {
        var billId = req.params['billId'];

        model.RestaurantModel.findOrderByBillId(billId)
            .then(function (order) {
                res.send(order)
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function placeOrder(req, res) {

        var order = req.body;

        model
            .RestaurantModel.placeOrder(order)
            .then(function (order) {
                if (order) {
                    res.send(order);

                } else {
                    res.sendStatus(500);
                }

            }, function (err) {
                console.log(err);
            });
    }
}
