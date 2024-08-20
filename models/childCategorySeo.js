const mongoose = require("mongoose");

const subCategorySeoSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "subCategory",
  },
  web_title: {
    type: String,
    required: true,
  },
  web_description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("subCateSeo", subCategorySeoSchema);
