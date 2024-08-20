const mongoose = require("mongoose");

const serviceScema = new mongoose.Schema(
  {
    description: String,
    heading: String,
    image: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("service", serviceScema);
