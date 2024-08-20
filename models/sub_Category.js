const mongoose = require("mongoose");

const subCategory = new mongoose.Schema(
  {
    category_description: {
      type: String,
    },
    name: {
      type: String,
    },
    category_image: {
      type: String,
    },
    category_status: {
      type: Boolean,
      default: true,
    },
    category_url: {
      type: String,
    },
    categoryType: {
      type: String,
      default: "product",
    },
    parent_id: {
      type: mongoose.Types.ObjectId,
      ref: "parent_category",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subCategory", subCategory);
