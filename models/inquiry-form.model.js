const mongoose = require("mongoose");

const inquiryFormSchema = new mongoose.Schema(
  {
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
    customProductId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomDesign",
      },
    ],
    sku: {
      type: String,
    },
    customFields: {},
    booleanFields: {
      inquiryForm: {
        fullName: {
          type: String,
          required: true,
        },
        emailAddress: {
          type: String,
          required: true,
        },
        phoneNo: {
          type: String,
          required: true,
        },
        yourQuery: {
          type: String,
          required: true,
        },
      },
    },
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
      // required: true,
    },
    titles: {
      type: String,
      // required: true,
    },
    prices: {
      type: String,
      default: "",
    },
    cartQuantity: Number,
    totalPrice: Number,
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

const InquiryFormModel = mongoose.model("InquiryForm", inquiryFormSchema);

module.exports = InquiryFormModel;
