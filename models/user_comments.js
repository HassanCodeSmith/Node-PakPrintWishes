const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    message: String,
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
