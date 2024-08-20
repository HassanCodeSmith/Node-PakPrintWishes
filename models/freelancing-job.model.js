const mongoose = require("mongoose");

const freelancingJobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Basic", "Intermediate", "Expert"],
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    jobAttachments: [],

    timeDuration: {
      type: String,
      trim: true,
    },

    jobPublished: {
      type: Boolean,
      default: false,
    },

    jobAssigned: {
      assigned: {
        type: Boolean,
        default: false,
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    priceBeforeAssignJob: {
      type: String,
    },

    priceAfterAssignJob: {
      type: String,
    },

    jobProposals: [
      {
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        summary: {
          type: String,
          trim: true,
          lowercase: true,
        },
        freelancerAttachments: [],
      },
    ],

    status: {
      type: String,
      enum: ["", "Completed", "Cancelled", "Active"],
      default: "",
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

const FreelancingJob = mongoose.model("FreelancingJob", freelancingJobSchema);

module.exports = FreelancingJob;
