(function () {
    angular.module('FoodLover')
        .factory('RestaurantService', RestaurantService);

    function RestaurantService($http) {
        var api = {
            "placeOrder": placeOrder,
            "findOrderByBillId": findOrderByBillId,
            "findOrderByUserId": findOrderByUserId,
            "findAllOrders": findAllOrders,
            "removeOrder": removeOrder
        };

        return api;

        function removeOrder(order) {
            return $http.put('/api/project/admin/restaurant/order', order);
        }

        function findAllOrders() {
            return $http.get('/api/project/admin/restaurant/order');
        }

        function findOrderByUserId(userId) {
            return $http.get('/api/project/restaurant/order/user/' + userId);
        }

        function findOrderByBillId(billId) {
            return $http.get('/api/project/restaurant/order/bill/' + billId);
        }

        function placeOrder(order,list) {
            var Order = {
                'restName': order.restName,
                'name': order.name,
                'userId': order.userId,
                'restId': order.restId,
                'order': []
            };

            Order.order.push(list);
            return $http.post('/api/project/restaurant/order', Order);
        }

    }
})();
