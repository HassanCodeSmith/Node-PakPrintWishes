const FreelancingJob = require("../models/freelancing-job.model");
const User = require("../models/user");
const SaveFreelancingJob = require("../models/save-freelancing-jobs.model");

const mongoose = require("mongoose");
const { trimObjects } = require("../utils/trimObjects.util");

/**
 * Add Freelancing Job
 */
exports.addFreelancingJob = async (req, res) => {
  try {
    const { userId } = req.user;
    const role = req.role;

    if (!(role === "admin" || role === "vendor")) {
      console.log("Invalid User Role");
      return res.status(400).json({
        success: false,
        message: "Invalid User Role",
      });
    }

    trimObjects(req.body);
    const { jobTitle, experienceLevel, jobDescription, priceBeforeAssignJob } =
      req.body;

    if (
      !(jobTitle && experienceLevel && jobDescription && priceBeforeAssignJob)
    ) {
      console.log("Please provide all the required fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    let jobAttachments;

    if (req.files.length !== 0) {
      jobAttachments = req.files.map((image) =>
        image?.location?.replace(/.*\/uploads/, "/uploads")
      );
    } else {
      console.log("At least one image is required");
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    req.body.jobAttachments = jobAttachments;

    const job = await FreelancingJob.create({ ...req.body, createdBy: userId });

    console.log("New freelancing job: ", job);

    return res.status(200).json({
      success: true,
      message: "Job created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Auth Get All Jobs
 */
exports.authGetAllFreelancingJobs = async (req, res) => {
  try {
    const { userId } = req.user;
    const userRole = req.role;

    if (userRole !== "admin" && userRole !== "vendor") {
      console.log("Invalid user role");
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    let freelancingJobs;

    if (userRole === "admin") {
      freelancingJobs = await FreelancingJob.find({
        permanentDeleted: false,
      })
        .populate({
          path: "jobAssigned.assignedTo",
          select:
            "first_name last_name email phone address bank_name bank_account_number cnic role",
          model: "User",
        })
        .populate({
          path: "jobProposals.createdBy",
          select:
            "first_name last_name email phone address bank_name bank_account_number cnic role",
          model: "User",
        });
    } else {
      freelancingJobs = await FreelancingJob.find({
        createdBy: new mongoose.Types.ObjectId(userId),
        permanentDeleted: false,
      })
        .populate({
          path: "jobAssigned.assignedTo",
          select:
            "first_name last_name email phone address bank_name bank_account_number cnic role",
          model: "User",
        })
        .populate({
          path: "jobProposals.createdBy",
          select:
            "first_name last_name email phone address bank_name bank_account_number cnic role",
          model: "User",
        });
    }

    if (freelancingJobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Freelancing jobs collection is empty",
        data: freelancingJobs,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Freelancing jobs retrieved successfully",
      data: freelancingJobs,
    });
  } catch (error) {
    console.error("Error during job retrieving - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Freelancing Job - before assign
 */
exports.deleteFreelancingJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.user;
    const userRole = req.role;

    if (userRole !== "admin" && userRole !== "vendor") {
      console.log("Invalid authentication");
      return res.status(400).json({
        success: false,
        message: "Invalid authentication",
      });
    }

    const job = await FreelancingJob.findOne({
      _id: jobId,
      permanentDeleted: false,
    });

    if (!job) {
      console.log("Invalid job id");
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    if (
      userRole !== "admin" ||
      job.createdBy.toString() !==
        new mongoose.Types.ObjectId(userId).toString()
    ) {
      console.log("You are not valid job creater");
      return res.status(400).json({
        success: false,
        message: "You are not valid job creater",
      });
    }

    if (job.jobAssigned.assigned) {
      console.log("Job can't be deleted because it already assigned");
      return res.status(400).json({
        success: false,
        message: "Job can't be deleted because it already assigned",
      });
    }

    const deletedJob = await FreelancingJob.findOneAndUpdate(
      { _id: jobId },
      { permanentDeleted: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    console.log("Error in delete freelancing job - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Freelancing Job = before assign
 */
exports.updateFreelancingJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.user;
    const userRole = req.role;

    if (userRole !== "admin" && userRole !== "vendor") {
      console.log("Invalid user role");
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const job = await FreelancingJob.findOne({
      _id: jobId,
      permanentDeleted: false,
    });

    if (!job) {
      console.log("Invalid job id");
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    if (
      userRole !== "admin" ||
      job.createdBy.toString() !==
        new mongoose.Types.ObjectId(userId).toString()
    ) {
      console.log("You are not valid job creater");
      return res.status(400).json({
        success: false,
        message: "You are not valid job creater",
      });
    }

    if (job.jobPublished) {
      console.log("Job can't be update because it already published");
      return res.status(400).json({
        success: false,
        message: "Job can't be update because it already published",
      });
    }

    const updatedFields = {};
    if (req.body.jobTitle) {
      updatedFields.jobTitle = req.body.jobTitle;
    } else {
      updatedFields.jobTitle = job.jobTitle;
    }

    if (req.body.jobDescription) {
      updatedFields.jobDescription = req.body.jobDescription;
    } else {
      updatedFields.jobDescription = job.jobDescription;
    }

    if (req.body.experienceLevel) {
      updatedFields.experienceLevel = req.body.experienceLevel;
    } else {
      updatedFields.experienceLevel = job.experienceLevel;
    }

    if (req.body.priceBeforeAssignJob) {
      updatedFields.priceBeforeAssignJob = req.body.priceBeforeAssignJob;
    } else {
      updatedFields.priceBeforeAssignJob = job.priceBeforeAssignJob;
    }

    if (req.files.length !== 0) {
      const jobAttachments = req.files.map((file) =>
        file.location.replace(/.*\/uploads/, "/uploads")
      );

      updatedFields.jobAttachments = jobAttachments;
    } else {
      updatedFields.jobAttachments = job.jobAttachments;
    }

    const updatedJob = await FreelancingJob.findOneAndUpdate(
      { _id: jobId },
      { $set: updatedFields },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.log("Error in update freelancing job - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Auth Get All Freelancing Proposals by Job ID
 */
exports.authGetAllProposalsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.user;
    const userRole = req.role;

    if (userRole !== "admin" && userRole !== "vendor") {
      console.log("Invalid authentication");
      return res.status(400).json({
        success: false,
        message: "Invalid authentication",
      });
    }

    const job = await FreelancingJob.findOne({
      _id: jobId,
      permanentDeleted: false,
    });

    if (!job) {
      console.log("Invalid job id");
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    if (
      job.createdBy.toString() !==
      new mongoose.Types.ObjectId(userId).toString()
    ) {
      console.log("You are not valid job creater");
      return res.status(400).json({
        success: false,
        message: "You are not valid job creater",
      });
    }

    if (job.jobProposals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Job proposals collection is empty",
        data: job.jobProposals,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job proposals retrieved successfully",
      data: job.jobProposals,
    });
  } catch (error) {
    console.error("Error during getting all proposals - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Send Job Proposal
 */
exports.sendJobProposal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { jobId } = req.params;

    const user = await User.findOne({ _id: userId, role: "freelancer" });

    if (!user) {
      console.log("Error in sending job proposal - Invalid User role");
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    trimObjects(req.body);

    const { summary, timeDuration } = req.body;

    if (!(summary && timeDuration)) {
      console.log(
        "Error in sending job proposal - Summary and Time duration fields are required"
      );
      return res.status(400).json({
        success: false,
        message: "Summary and Time duration fields are required",
      });
    }

    let freelancerAttachments = [];
    if (req.files) {
      freelancerAttachments = req.files.map((file) =>
        file.location.replace(/.*\/uploads/, "/uploads")
      );
    }

    const job = await FreelancingJob.findOne({ _id: jobId });

    if (!job) {
      console.log("Error in sending job proposal - Job not found");
      return res.status(400).json({
        success: false,
        message: "Job not found - Invalid job id",
      });
    }

    const isProposalExist = job.jobProposals.some(
      (proposal) => proposal.createdBy.toString() === userId.toString()
    );

    if (isProposalExist) {
      console.log("Error in sending job proposal - Proposal already sent");
      return res.status(400).json({
        success: false,
        message: "Proposal already sent for this job",
      });
    }

    await FreelancingJob.updateOne(
      { _id: jobId },
      {
        $addToSet: {
          jobProposals: {
            createdBy: userId,
            timeDuration,
            summary,
            freelancerAttachments,
          },
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Job proposal sent successfully",
    });
  } catch (error) {
    console.error("Error in sending job proposal - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Assigned Job to Freelancer
 */
exports.assignJobToFreelancer = async (req, res) => {
  try {
    const { jobId, freelancerId } = req.params;

    const { userId } = req.user;
    const userRole = req.role;
    const { priceAfterAssignJob } = req.body;

    if (!priceAfterAssignJob) {
      console.log(
        "Error in assigning job to freelancer - Final price must be required"
      );
      return res.status(400).json({
        success: false,
        message: "Final price must be required",
      });
    }

    const job = await FreelancingJob.findOne({
      _id: jobId,
      permanentDeleted: false,
    });

    if (!job) {
      console.log("Error in assigning job to freelancer - Job not found");
      return res.status(400).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.jobAssigned.assigned) {
      console.log(
        "Error in assigning job to freelancer - Job already assigned"
      );
      return res.status(400).json({
        success: false,
        message: "Job already assigned",
      });
    }

    let isFreelancerIdExistsInJobProposals = false;
    job.jobProposals.forEach((proposal) => {
      if (proposal.createdBy.toString() === freelancerId.toString()) {
        isFreelancerIdExistsInJobProposals = true;
      }
    });

    if (!isFreelancerIdExistsInJobProposals) {
      console.log(
        "Error in assigning job to freelancer - Freelancer not found in job proposals"
      );
      return res.status(400).json({
        success: false,
        message: "Freelancer not found in job proposals",
      });
    }

    if (
      job.createdBy.toString() !==
      new mongoose.Types.ObjectId(userId).toString()
    ) {
      console.log(
        "Error in assigning job to freelancer - Invalid job provider"
      );
      return res.status(400).json({
        success: false,
        message: "Invalid job provider",
      });
    }

    if (userRole !== "admin" && userRole !== "vendor") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const isFreelancerValid = await User.findOne({
      _id: freelancerId,
      blocked: false,
      permanentDeleted: false,
      softDeleted: false,
    });

    if (!isFreelancerValid) {
      console.log("Invalid freelancer");
      return res.status(400).json({
        success: false,
        message: "Invalid freelancer",
      });
    }

    const jobAssigned = await FreelancingJob.findOneAndUpdate(
      { _id: jobId },
      {
        $set: {
          jobPublished: true,
          priceAfterAssignJob,
          "jobAssigned.assigned": true,
          "jobAssigned.assignedTo": freelancerId,
        },
      },
      { new: true }
    ).populate(
      "jobAssigned.assignedTo",
      "first_name last_name email phone address"
    );

    return res.status(200).json({
      success: true,
      message: "Job assigned successfully",
      data: jobAssigned,
    });
  } catch (error) {
    console.error("Error in assigning job to freelancer - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Freelancing Jobs
 */
exports.getAllFreelancingJobs = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({
      _id: userId,
      blocked: false,
      softDeleted: false,
      permanentDeleted: false,
    });

    if (!user) {
      console.log(
        "User not found - May be invalid user id, blocked, temporarily deleted or permanent deleted"
      );
      return res.status(400).json({
        success: false,
        message:
          "User not found - May be invalid user id, blocked, temporarily deleted or permanent deleted",
      });
    }

    if (user.role === "user") {
      console.log("Invalid user role");
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const jobs = await FreelancingJob.find({
      "jobAssigned.assigned": false,
      permanentDeleted: false,
      experienceLevel: user.experience.experienceLevel,
    })
      .select("createdAt jobTitle jobProposals priceBeforeAssignJob")
      .sort({
        updatedAt: -1,
      });

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Freelancing jobs collection is empty",
        data: jobs,
      });
    }

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.log("Error in get all freelancing jobs - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Job Details using ID
 */
exports.getFreelancingJobDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await FreelancingJob.findOne({
      _id: id,
      "jobAssigned.assigned": false,
      permanentDeleted: false,
    }).populate("createdBy", "-password");

    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log("Error in get freelancing job details - ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Save Job
 */
exports.saveAndUnSaveFreelancingJob = async (req, res) => {
  try {
    const { userId } = req.user;
    const { jobId } = req.params;

    const existedJob = await SaveFreelancingJob.findOne({
      jobId,
      createdBy: userId,
    });

    let status = "";
    if (existedJob?.permanentDeleted === true) {
      existedJob.permanentDeleted = false;
      await existedJob.save();
      status = "saved";
    } else if (existedJob?.permanentDeleted === false) {
      existedJob.permanentDeleted = true;
      await existedJob.save();
      status = "un-saved";
    } else {
      await SaveFreelancingJob.create({
        jobId,
        createdBy: userId,
      });
      status = "saved";
    }

    return res.status(200).json({
      success: false,
      message: `Job ${status} successfully`,
    });
  } catch (error) {
    console.log("saveAndUnSaveFreelancingJob Error: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Save Jobs
 */
exports.getAllSaveJobs = async (req, res) => {
  try {
    const { userId } = req.user;

    const saveJobs = await SaveFreelancingJob.find({
      createdBy: userId,
      permanentDeleted: false,
    })
      .populate("jobId")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      data: saveJobs,
    });
  } catch (error) {
    console.log("getAllSaveJobs Error: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Save Job
 */
exports.getSingleSaveJob = async (req, res) => {
  try {
    const { userId } = req.user;
    const { underScoreId } = req.params;

    const saveJob = await SaveFreelancingJob.findOne({
      _id: underScoreId,
      createdBy: userId,
      permanentDeleted: false,
    })
      .populate("jobId")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      data: saveJob,
    });
  } catch (error) {
    console.log("getSingleSaveJob Error: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Change Job Status
 */
exports.changeJobStatus = async (req, res) => {
  try {
    const userRole = req.role;

    const { underScoreId } = req.params;
    const { status } = req.body;

    if (userRole !== "admin" && userRole !== "vendor") {
      console.log("Invalid user role");
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const job = await FreelancingJob.findOne({
      _id: underScoreId,
    });

    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    if (job.permanentDeleted) {
      return res.status(400).json({
        success: false,
        message: "Can't chnage job status job is deleted",
      });
    }

    job.status = status;
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully",
    });
  } catch (error) {
    console.log("changeJobStatus catch error: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
