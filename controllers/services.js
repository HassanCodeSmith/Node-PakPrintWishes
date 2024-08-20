const service = require("../models/service");
const Services = require("../models/service");

exports.getAllServices = async (req, res) => {
  try {
    const services = await Services.find({}).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { description, heading } = req.body;
    if (!description || !heading) {
      return res
        .status(400)
        .json({ success: false, message: "Please Fill All Require Fields" });
    }
    if (req.file) {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");

      const image = relativePath;

      const service = await Services.create({
        heading,
        description,
        image,
      });
      return res.status(200).json({ success: true, data: service });
    }
    return res
      .status(400)
      .json({ success: false, message: "Please provide image" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const check = await Services.findById(serviceId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    const service = await Services.findByIdAndDelete(serviceId);
    return res.status(200).json({ success: true, id: serviceId });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMultipleServices = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;

    await Services.deleteMany({ _id: { $in: ids } });

    const remainingService = await Services.find({});

    return res.status(200).json({ success: true, data: remainingService });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }

    let image = null; // Default value
    if (req.file) {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");
      image = relativePath;
    }

    const { serviceId } = req.params;
    const check = await Services.findById(serviceId);

    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    await Services.findOneAndUpdate({ _id: serviceId }, { ...req.body, image });

    return res
      .status(200)
      .json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
