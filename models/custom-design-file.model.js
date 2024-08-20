const mongoose = require("mongoose");

const customDesignFileSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CustomDesignFileModel = mongoose.model(
  "CustomDesignFile",
  customDesignFileSchema
);
module.exports = CustomDesignFileModel;
