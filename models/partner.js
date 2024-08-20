const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    description: String,
    logo: String,
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("partner", partnerSchema);
