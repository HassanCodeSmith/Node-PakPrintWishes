const mongoose = require("mongoose");

const forSEO = new mongoose.Schema({
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: "product",
  },
  web_title: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  web_description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("seo", forSEO);
