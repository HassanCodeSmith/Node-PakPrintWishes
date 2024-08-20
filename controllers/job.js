const Job = require("../models/job");

exports.getJob = async (req, res) => {
  try {
    const jobs = await Job.findById(req.params.id);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      const jobs = await Job.find({
        notSoftDelete: {
          $ne: false,
        },
        permanentDeleted: false,
      });
      return res.status(200).json({ success: true, data: jobs });
    }
    const regex = new RegExp(`\\b${city}\\b`, "i");

    const jobs = await Job.find({ city: regex, permanentDeleted: false });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllJobsPublic = async (req, res) => {
  try {
    const jobs = await Job.find({
      notSoftDelete: {
        $ne: false,
      },
      permanentDeleted: false,
    }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    let query = { permanentDeleted: false };

    req.role !== "admin" ? (query.createdBy = req.user.userId) : null;

    const jobs = await Job.find(query).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      responsibilities,
      companyName,
      city,
      country,
      jobType,
      skills,
      salary,
      status,
      noOfPositions,
      lastDate,
      description,
    } = req.body;
    console.log(req.body);
    if (
      !title ||
      !responsibilities ||
      !companyName ||
      !city ||
      !country ||
      !jobType ||
      !skills ||
      !salary ||
      !status ||
      !noOfPositions ||
      !lastDate ||
      !description
    ) {
      console.log("fill all fields");
      return res
        .status(400)
        .json({ success: false, message: "Fill all required fields" });
    }
    const { userId } = req.user;
    const newJob = await Job.create({
      title,
      responsibilities,
      companyName,
      city,
      country,
      jobType,
      skills,
      salary,
      status,
      noOfPositions,
      lastDate,
      description,
      createdBy: userId,
    });
    return res.status(200).json({ data: newJob, success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const check = await Job.findById(jobId);
    if (!check) {
      return res.status(404).json({ message: "job not found", success: false });
    }
    switch (req.role) {
      case "admin":
        await Job.findOneAndUpdate(
          { _id: jobId },
          { ...req.body },
          { new: true }
        );
        break;
      case "vendor":
        if (req.user.userId.toString() === check.createdBy.toString()) {
          await Job.findOneAndUpdate(
            { _id: jobId },
            { ...req.body },
            { new: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to update this job.",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this job.",
        });
    }
    await Job.findOneAndUpdate({ _id: jobId }, { ...req.body }, { new: true });
    return res.status(200).json({ message: "Updated...", success: true });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const check = await Job.findById(jobId);
    if (!check) {
      return res.status(404).json("No Job Found");
    }
    switch (req.role) {
      case "admin":
        await Job.findOneAndUpdate({ _id: jobId }, { permanentDeleted: true });
        break;
      case "vendor":
        if (req.user.userId.toString() === check.createdBy.toString()) {
          await Job.findOneAndUpdate(
            { _id: jobId },
            { permanentDeleted: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to remove this job.",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to remove this job.",
        });
    }

    return res.status(200).json({ success: true, message: "Deleted..." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMultipleJobs = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;

    await Job.updateMany(
      { _id: { $in: ids } },
      { $set: { permanentDeleted: true } }
    );

    const remaining = await Job.find({});
    return res
      .status(200)
      .json({ success: true, message: "Deleted...", data: remaining });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
