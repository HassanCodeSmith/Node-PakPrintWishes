const mongoose = require("mongoose");

const jobProposalSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    attachments: [],
  },
  { timestamps: true }
);

const JobProposal = mongoose.model("JobProposal", jobProposalSchema);

module.exports = JobProposal;
