const reviewRouter = require("express").Router();
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");
const {
  addReview,
  getReviewByProduct,
  deleteReview,
  updateReview,
  getAllReviews,
  deleteMultipleReviews,
} = require("../controllers/review");

reviewRouter.post(
  "/addReview",
  upload.single("feedbackImage"),
  authMiddleware,
  addReview
);
reviewRouter.get("/getReviewByProduct/:productId", getReviewByProduct);
reviewRouter.get("/getReview", authMiddleware, adminAuth, getAllReviews);
reviewRouter.delete("/delete-Review/:id", deleteReview);
reviewRouter.patch(
  "/updateReview-Review/:id",
  upload.single("feedbackImage"),
  authMiddleware,
  updateReview
);
reviewRouter.post(
  "/multipleDeleteReview",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultipleReviews
);

module.exports = reviewRouter;
