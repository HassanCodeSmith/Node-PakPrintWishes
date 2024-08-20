const mongoose = require("mongoose");

const customParentCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Custom parent category title must be provided"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Custom parent category description must be provided"],
      trim: true,
    },
    customParentCategoryImage: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
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

const CustomParentCategoryModel = mongoose.model(
  "customParentCategory",
  customParentCategorySchema
);

module.exports = CustomParentCategoryModel;
