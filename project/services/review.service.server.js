module.exports = function (app, model) {

    app.post('/api/project/review/:restName/user/:username', addReview);
    app.get('/api/project/review/:restName', findReviewsForRestaurant);
    app.get('/api/project/review/user/:username', findAllReviewsByUser);
    app.get('/api/project/admin/reviews', findAllReviews);
    app.put('/api/project/admin/review', removeReview);
    app.delete('/api/project/user/review/delete/:reviewId', deleteReview);


    function deleteReview(req, res) {
        var review = req.params['reviewId'];

        model.ReviewModel.deleteReview(review)
            .then(function (review) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500);
            })
    }


    function removeReview(req, res) {
        var review = req.body;
        if (req.user && req.user.roles == 'ADMIN') {
            model.ReviewModel.removeReview(review)
                .then(function (response) {
                    res.sendStatus(200)
                }, function (err) {
                    res.sendStatus(500).send(err);
                })
        }
    }

    function findAllReviews(req, res) {
        if (req.user && req.user.roles == "ADMIN") {
            model.ReviewModel.findAllReviews()
                .then(function (reviews) {
                    res.send(reviews);
                })
        } else {
            res.sendStatus(401);
        }
    }

    function findAllReviewsByUser(req, res) {
        var username = req.params['username'];

        model.ReviewModel.findAllReviewsByUser(username)
            .then(function (reviews) {
                if (reviews) {
                    res.send(reviews);
                } else {
                    res.sendStatus(404).send('No reviews for the user found.')
                }
            })
    }

    function findReviewsForRestaurant(req, res) {
        var restName = req.params['restName'];

        model.ReviewModel.findReviewsForRestaurant(restName)
            .then(function (reviews) {
                if (reviews) {
                    res.send(reviews)
                } else {
                    res.sendStatus(404).send("No reviews found for the restaurant.")
                }
            })
    }

    function addReview(req, res) {
        var restName = req.params['restName'];
        var username = req.params['username'];
        var review = req.body;

        model.ReviewModel.addReview(username, restName, review)
            .then(function (review) {
                if (review) {
                    res.send(review);
                } else {
                    res.sendStatus(500);
                }
            })
    }
}
