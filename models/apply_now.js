const mongoose = require("mongoose");

const applyNowSchema = new mongoose.Schema(
  {
    applyPosition: {
      type: String,
    },
    attachFile: {
      type: String,
    },
    email: {
      type: String,
    },
    fullName: {
      type: String,
    },
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "job",
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("apply_now", applyNowSchema);
