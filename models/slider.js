const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    parent_Id: {
      type: mongoose.Types.ObjectId,
      ref: "parent_category",
    },
    sliderDescription: String,
    sliderImage: String,
    sliderStatus: {
      type: Boolean,
      default: true,
    },
    subTitle: String,
    title: String,
    url: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("slider", sliderSchema);
