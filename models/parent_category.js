const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    name: String,
    category_description: String,
    category_image: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
    type: String,
    categoryType: {
      type: String,
      default: "product",
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    productStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("parent_category", parentSchema);
