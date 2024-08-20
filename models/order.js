const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: String,
    phone: Number,
    delivery_address: String,
    sub_total: Number,
    total_shipping_fee: Number,
    all_totals: Number,
    products: [
      {
        product_id: {
          type: mongoose.Types.ObjectId,
          ref: "product",
        },
        orderId: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        new_price: {
          type: Number,
        },
        old_price: {
          type: Number,
        },
        discount: {
          type: Number,
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
    payment_method: {
      type: String,
    },
    assignedCompleteOrderVendor: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    softDelete: {
      type: Boolean,
      default: false,
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
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
