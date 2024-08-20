const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    brand_status: {
      type: String,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
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

module.exports = mongoose.model("brand", brandSchema);
