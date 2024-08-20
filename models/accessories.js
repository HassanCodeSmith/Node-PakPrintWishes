const mongoose = require("mongoose");
const accesseriesSchema = new mongoose.Schema(
  {
    parentCatagory:String,
    category: String,
    brand: String,
    price: Number,
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: String,
      enum: ["New", "Used"],
    },
    location: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    title: String,
    description: String,
    customFields: [{ customTitle: String, customDescription: String }],
    images: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("accessories", accesseriesSchema);
