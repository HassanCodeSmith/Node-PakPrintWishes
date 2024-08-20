const mongoose = require("mongoose");

const imageGallerySchema = new mongoose.Schema({
  imgUrl: String,
  createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
  folderId: { type: mongoose.Types.ObjectId, ref: "parent_category" },
  softDelete: { type: Boolean, default: false },
  isDeletedBy: { type: Boolean, default: false },
});

module.exports = mongoose.model("imageGallery", imageGallerySchema);
