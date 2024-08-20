const mongoose = require("mongoose");

const wallet = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
    withdrawBalance: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wallet", wallet);
