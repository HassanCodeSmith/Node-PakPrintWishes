const mongoose = require("mongoose");

const saveFreelancingJobsSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FreelancingJob",
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

const SaveFreelancingJob = mongoose.model(
  "SaveFreelancingJob",
  saveFreelancingJobsSchema
);

module.exports = SaveFreelancingJob;
