const mongoose = require("mongoose");

const customChildCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Custom child category title must be provided"],
      trim: true,
    },
    customParentCategoryIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "customParentCategory",
      },
    ],
    description: {
      type: String,
      required: [true, "Custom child category discription must be provided"],
      trim: true,
    },
    customChildCategoryImage: {
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

const CustomChildCategoryModel = mongoose.model(
  "customChildCategory",
  customChildCategorySchema
);

module.exports = CustomChildCategoryModel;
