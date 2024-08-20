const mongoose = require("mongoose");

const getQuoteSchema = new mongoose.Schema(
  {
    attachFile: {
      type: String,
    },
    colorOption: String,
    comment: String,
    email: String,
    height: String,
    width: String,
    length: String,
    name: String,
    phone: String,
    printingType: String,
    quantity_1: Number,
    quantity_2: Number,
    quantity_3: Number,
    rate: Number,
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirm", "Deliver"],
    },
    boxType: {
      type: String,
    },
    typeCard: {
      type: String,
    },
    isSoftDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("getQuote", getQuoteSchema);
