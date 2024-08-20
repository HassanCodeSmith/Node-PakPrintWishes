const Review = require("../models/review");
const Product = require("../models/product");
const Order = require("../models/order");
const user = require("../models/user");

exports.addReview = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { productId, comment, rating, orderId } = req.body;
    // console.log(req.body);
    // console.log(req.user);
    if (!productId || !comment || !rating) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const checkOrder = await Order.findById(orderId);
    if (!checkOrder) {
      return res
        .status(400)
        .json({ success: false, message: "No Order Found" });
    }
    if (!checkOrder.status === "Completed") {
      return res
        .status(400)
        .json({ success: false, message: "Your Order is not Completed yet" });
    }
    if (req.file) {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");

      const feedbackImage = relativePath;
      const review = await Review.create({
        productId,
        userId,
        orderId,
        comment,
        rating,
        feedbackImage,
      });
      return res.status(201).json({ success: true, data: review });
    }
    const review = await Review.create({
      productId,
      userId,
      orderId,
      comment,
      rating,
    });

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getReviewByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate({
      path: "userId",
      select: "first_name last_name",
    });
    console.log(reviews);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Your Review has been Deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { productId, comment, rating } = req.body;
    if (!productId || !comment || !rating) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingReview = await Review.findById(id);

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    const currentTime = new Date();
    const createdAtTime = existingReview.createdAt;
    const timeDifference = currentTime - createdAtTime;

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    if (timeDifference >= oneDayInMilliseconds) {
      return res
        .status(400)
        .json({ message: "You cannot update a comment older than one day" });
    }
    let feedbackImage = existingReview.feedbackImage;

    if (req.file) {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");
      feedbackImage = relativePath;
    }

    const updatedReview = await Review.findByIdAndUpdate(id, {
      productId,
      userId,
      comment,
      rating,
      feedbackImage,
    });

    return res.status(200).json({
      success: true,
      data: updatedReview,
      message: "Your Review Has been Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({ updatedAt: -1 })
      .populate({ path: "productId", select: "product_title images " })
      .populate({ path: "userId", select: "first_name" });
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMultipleReviews = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    await Review.deleteMany({ _id: { $in: ids } });
    // const { url } = req;
    // console.log(req.url);
    // const role = url === "/vendor/deleteMultipleUsers" ? "vendor" : "user";
    const remainingReview = await Review.find({});
    return res.status(200).json({
      message: "Reviews deleted successfully",
      success: true,
      data: remainingReview,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
