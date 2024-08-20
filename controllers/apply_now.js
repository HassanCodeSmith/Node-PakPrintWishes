const ApplyNow = require("../models/apply_now");
const Job = require("../models/job");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const applyJob = require("../templates/JobApply");
const sendNotification = require("../utils/sendNotificatoin");

exports.applyForJob = async (req, res) => {
  try {
    const { applyPosition, email, fullName, jobId, phone } = req.body;
    // console.log(req.body);
    if (!email || !fullName || !jobId || !phone || !applyPosition) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const findJob = await Job.findById(jobId).populate("createdBy");
    const checkapply = await ApplyNow.findOne({ email, jobId });
    // console.log(checkapply);
    if (checkapply) {
      return res
        .status(400)
        .json({ success: false, message: "You already apply for the Job" });
    }
    if (!findJob) {
      return res.status(400).json({
        success: false,
        message: "Job not found",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }
    const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

    const attachFile = relativePath;

    const applyNow = await ApplyNow.create({
      applyPosition,
      email,
      fullName,
      jobId,
      phone,
      attachFile,
    });

    const notification = await Notification.create({
      reciever: findJob.createdBy._id,
      title: "Job Application received",
      body: `${fullName} has applied for ${applyPosition}`,
      type: "job",
      id: jobId,
    });

    const applyJobTemplate = applyJob(
      findJob.title,
      findJob.createdBy.first_name,
      fullName,
      email,
      phone
    );

    sendEmail({
      to: findJob.createdBy.email,
      subject: "Job Application Received",
      html: applyJobTemplate,
    });

    // findJob.createdBy.fcm_token.forEach((token) => {
    //   sendNotification({
    //     to: token,
    //     notification: {
    //       title: "PakPrintwishes",
    //       body: "Job Application Received",
    //     },
    //   });
    // });

    return res.status(200).json({
      success: true,
      message: "Apply for Job Successfully",
      data: applyNow,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.applicationForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const check = await Job.findById(jobId).sort({ updatedAt: -1 });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Job not found",
      });
    }

    const applications = await ApplyNow.find({ jobId });

    return res.status(200).json({
      success: true,
      message: "Application for Job Successfully",
      data: applications,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    await ApplyNow.findByIdAndDelete(applicationId);

    return res.status(200).json({
      success: true,
      message: "Application Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMultipleApplications = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    console.log(req.body);
    await ApplyNow.deleteMany({ _id: { $in: ids } });

    const remaining = await ApplyNow.find({});
    return res.status(200).json({
      success: true,
      message: "Application Deleted Successfully",
      data: remaining,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
