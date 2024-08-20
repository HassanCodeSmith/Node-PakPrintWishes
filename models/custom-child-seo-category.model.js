const mongoose = require("mongoose");

const customChildSeoCategorySchema = new mongoose.Schema(
  {
    customChildCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customChildCategory",
      required: true,
    },
    webTitle: {
      type: String,
      required: true,
    },
    webDescription: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CustomChildSeoCategoryModel = mongoose.model(
  "customChildSeoCategory",
  customChildSeoCategorySchema
);

module.exports = CustomChildSeoCategoryModel;
