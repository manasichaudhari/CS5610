module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String},
        facebook: {
            id: String,
            token: String
        },
        google: {
            id: String,
            token: String
        },
        firstName: String,
        lastName: String,
        email: String,
        phone: Number,
        password: String,
        favourites: [{'id': String, 'restaurantName': String}],
        follows: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        followedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        roles: {type: String, enum: ['USER', 'ADMIN', 'MANAGER'], default: 'USER'}
    }, {collection: "project_user"});
    return UserSchema;
}