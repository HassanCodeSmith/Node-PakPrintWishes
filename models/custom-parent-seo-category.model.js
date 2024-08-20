const mongoose = require("mongoose");

const customParentSeoCategorySchema = new mongoose.Schema(
  {
    customParentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customParentCategory",
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

const CustomParentSeoCategoryModel = mongoose.model(
  "CustomParentSeoCategory",
  customParentSeoCategorySchema
);

module.exports = CustomParentSeoCategoryModel;
