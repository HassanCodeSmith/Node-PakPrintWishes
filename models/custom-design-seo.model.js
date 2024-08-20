const mongoose = require("mongoose");

const customDesignSeoSchema = new mongoose.Schema(
  {
    customDesignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomDesign",
      required: true,
    },
    webTitle: {
      type: String,
      required: true,
    },
    webDescription: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CustomDesignSeoModel = mongoose.model(
  "CustomDesignSeo",
  customDesignSeoSchema
);

module.exports = CustomDesignSeoModel;
