const mongoose = require("mongoose");

const customDesignSchema = new mongoose.Schema({
  customParentCategoryIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customParentCategory",
    },
  ],
  customChildCategoryIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customChildCategory",
    },
  ],
  sku: {
    type: String,
  },
  customFields: {},
  booleanFields: {},
  objectFields: {},
  stringFields: {
    description: {
      value: String,
      status: {
        type: Boolean,
        default: false,
      },
    },
    productDescription: {
      value: String,
      status: {
        type: Boolean,
        default: false,
      },
    },
  },
  images: {
    type: Object,
    required: true,
  },
  titles: {
    type: String,
    required: true,
  },
  prices: {
    type: String,
    default: "",
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
});

const customDesign = mongoose.model("CustomDesign", customDesignSchema);

module.exports = customDesign;
