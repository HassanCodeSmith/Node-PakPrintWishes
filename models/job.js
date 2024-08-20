const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    city: {
      type: String,
    },
    companyName: {
      type: String,
    },
    country: {
      type: String,
    },
    description: {
      type: String,
    },
    expiredAt: {
      type: Date,
    },
    jobType: {
      type: String,
    },
    lastDate: {
      type: String,
    },
    location: {
      type: String,
    },
    noOfPositions: {
      type: Number,
    },
    responsibilities: String,
    salary: Number,
    skills: String,
    status: String,
    title: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    notSoftDelete: {
      type: Boolean,
      default: true,
    },
    // status: {
    //   type: Boolean,
    //   default: true,
    // },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("job", jobSchema);
