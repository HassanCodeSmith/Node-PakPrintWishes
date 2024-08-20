const mongoose = require("mongoose");

const walletHistory = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    payAmount: {
      type: Number,
      required: true,
    },
    screenshot: {
      type: String,
      required: true,
    },
    TID: {
      type: String,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
    },
    remainingBalance: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    vendorBankName: String,
    vendorBankNo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("walletHistory", walletHistory);
