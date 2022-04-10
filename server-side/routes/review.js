const express = require("express");
const Review = require("../models/review");
const {
  isAuthenticated,
  isAuthenticatedAndAuthorized,
} = require("../middleware/auth");

const router = express.Router();

// @routes  GET api/review/
// @desc    Get all reviews about all products
// @access  Public
router.get("/", (req, res) => {
  Review.find()
    .then((reviews) => {
      if (!reviews) {
        res.status(200).json({ reviews: [] });
      } else {
        res.status(200).json(reviews);
      }
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  GET api/review/:productId
// @desc    Get product reviews by productId
// @access  Public
router.get("/:id", (req, res) => {
  Review.findOne({ productId: req.params.id })
    .then((reviews) => {
      if (!reviews) {
        res.status(200).json({ reviews: [] });
      } else {
        res.status(200).json(reviews);
      }
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  POST api/review/:productId
// @desc    Add product review
// @access  Private - Any Logged In user
router.post("/:id", isAuthenticated, (req, res) => {
  Review.findOne({ productId: req.params.id })
    .then((productReview) => {
      // check if product has any review
      if (productReview) {
        const isUserExist = productReview.reviews.findIndex(
          (user) => user.userId.toString() === req.user.id
        );

        // check if user try to give a review more than once for the same product
        if (isUserExist > -1) {
          return res.status(400).json({
            errMsg: "You already given a review for this product",
          });
        }
        // user hasn't given a review before, push new review
        else {
          productReview.reviews.push({
            userId: req.user.id,
            username: req.body.username,
            rating: req.body.rate,
            comment: req.body.comment,
          });
          productReview.totalRate =
            Math.round(
              (productReview.reviews
                .map((rate) => rate.rating)
                .reduce((acc, next) => acc + next) /
                productReview.reviews.length) *
                100
            ) / 100;

          productReview
            .save()
            .then((review) => {
              res.status(200).json(review);
            })
            .catch((err) =>
              res.status(500).json({ errMsg: "Review is not posted" })
            );
        }
      }
      // product has no review, create new review
      else {
        const newReview = new Review({
          productId: req.params.id,
          reviews: [
            {
              userId: req.user.id,
              username: req.body.username,
              rating: req.body.rate,
              comment: req.body.comment,
            },
          ],
          totalRate: req.body.rate,
        })
          .save()
          .then((review) => {
            res.status(200).json(review);
          })
          .catch((err) =>
            res.status(500).json({ errMsg: "Review is not posted" })
          );
      }
    })
    .catch((err) => res.status(500).json(err));
});

// @routes  DELETE api/review/:userId/:productId/:cartId/
// @desc    Delete review using id that found in reviews array
// @access  Private - Authorized user
router.delete(
  "/:id/:productId/:reviewId",
  isAuthenticatedAndAuthorized,
  (req, res) => {
    Review.findOneAndUpdate(
      { productId: req.params.productId },
      { $pull: { reviews: { _id: req.params.reviewId } } },
      { new: true }
    )
      .then((deletedReview) => {
        // if product review is empty then delete product from review collection
        if (deletedReview.reviews.length === 0) {
          Review.findByIdAndDelete(deletedReview._id)
            .then(() => res.status(200).json({ reviews: [] }))
            .catch((err) => console.log(err));
        } else {
          deletedReview.totalRate =
            Math.round(
              (deletedReview.reviews
                .map((rate) => rate.rating)
                .reduce((acc, next) => acc + next) /
                deletedReview.reviews.length) *
                100
            ) / 100;

          Review.findByIdAndUpdate(
            deletedReview._id,
            { $set: deletedReview },
            { new: true }
          )
            .then((updatedReview) => res.status(200).json(updatedReview))
            .catch((err) => res.status(500).json(err));
        }
      })
      .catch((err) => res.status(500).json(err));
  }
);

module.exports = router;
