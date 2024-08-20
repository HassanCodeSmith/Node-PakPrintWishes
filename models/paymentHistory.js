const mongoose = require("mongoose");
const paymentHistorySchema = new mongoose.Schema(
  {
    TID: "String",
    orderId: {
      type: [mongoose.Types.ObjectId],
      ref: "vendorOrders",
    },
    vendorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    payPrice: Number,
    paymentPending: Number,
    paymentRecieved: Number,
    paymentTotal: Number,
    // totalNewPrice: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("paymentHistory", paymentHistorySchema);
