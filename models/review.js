const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    comment: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    feedbackImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
