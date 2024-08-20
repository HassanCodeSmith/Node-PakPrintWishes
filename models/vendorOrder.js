const mongoose = require("mongoose");

const vendorOrders = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
    products: [
      {
        product_id: {
          type: mongoose.Types.ObjectId,
          ref: "product",
        },
        orderId: String,
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
        "Cancelled",
        "Return",
      ],
      default: "Pending",
    },
    disputeDescription: {
      type: String,
    },
    // deliveryOrderStatus: {
    //   type: {
    //     type: String,
    //     enum: ["approved", "disputed", "cancelled"],
    //   },
    //   description: {
    //     type: String,
    //   },
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("vendorOrders", vendorOrders);
