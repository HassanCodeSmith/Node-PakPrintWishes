const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    id: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "order",
        "customProductOrder",
        "quote",
        "amount",
        "job",
        "chat",
        "userOrder",
        "vendorRegister",
        "parentCategory",
        "newProduct",
        "updateProduct",
        "order",
      ],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
