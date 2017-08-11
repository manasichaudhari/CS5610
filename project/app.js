var connectionString = 'mongodb://127.0.0.1:27017/project';

if (process.env.MONGODB_URI) {
    connectionString = process.env.MONGODB_URI;
}

var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
mongoose.connect(connectionString, {
    useMongoClient: true
});
module.exports = function (app) {
    var model = require("./model/model.server.js")();

    require('./services/user.service.server')(app, model);
    require('./services/review.service.server')(app, model);
    require('./services/restaurant.service.server')(app, model);
}