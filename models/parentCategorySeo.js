const mongoose = require("mongoose");

const categorySeoSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Types.ObjectId,
    ref: "parent_category",
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

module.exports = mongoose.model("catSeo", categorySeoSchema);
