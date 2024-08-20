const mongoose = require("mongoose");

const customProductOrderSchema = new mongoose.Schema(
  {
    customOrderCode: String,
    name: String,
    phone: Number,
    delivery_address: String,
    payment_method: String,
    customTotal: String,
    customQuantity: String,
    total_shipping_fee: Number,
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
        status: {
          type: String,
          enum: ["Pending", "Deliver", "Completed", "Cancelled", "Confirm"],
          default: "Pending",
        },
        assigned: {
          type: Boolean,
          default: false,
        },
        assignedVendor: {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    assignedCompleteOrderVendor: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    completeAsign: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Deliver", "Completed", "Cancelled", "Confirm"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CustomProductOrderModel = mongoose.model(
  "customProductOrder",
  customProductOrderSchema
);

module.exports = CustomProductOrderModel;
