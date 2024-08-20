const mongoose = require("mongoose");

const vendorCustomOrderSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    customProductOrderId: {
      type: mongoose.Types.ObjectId,
      ref: "customProductOrder",
    },
    customProduct: [
      {
        customProductId: {
          type: mongoose.Types.ObjectId,
          ref: "CustomDesign",
        },
        cartQuantity: String,
        totalPrice: String,
        customFields: {},
        booleanFields: {},
        prices: String,
      },
    ],
    type: {
      type: String,
      enum: ["Partial", "Complete"],
    },
    softDelete: {
      type: Boolean,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirm",
        "Cancelled",
        "Completed",
        "Delivered",
        "Approved",
        "Disputed",
        "Return",
      ],
      default: "Pending",
    },
    disputeDescription: {
      type: String,
    },
    softDeleted: {
      type: Boolean,
      default: false,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const VendorCustomOrderModel = mongoose.model(
  "vendorCustomOrders",
  vendorCustomOrderSchema
);

module.exports = VendorCustomOrderModel;
