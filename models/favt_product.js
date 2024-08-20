const mongoose = require("mongoose");

const favtProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

// favtProductSchema.Schema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("favtProduct", favtProductSchema);
