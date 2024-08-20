const Partner = require("../models/partner");

exports.addPartner = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        message: "Please provide name and description",
      });
    }
    // console.log("====>>", req.file);
    if (req.file) {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");

      const logo = relativePath;
      const partner = await Partner.create({
        name,
        description,
        logo,
      });
      return res.status(200).json({ success: true, data: partner });
    }
    return res
      .status(400)
      .json({ success: false, message: "Please provide image" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllPartner = async (req, res) => {
  try {
    const partners = await Partner.find({}).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: partners });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { partnerId } = req.params;
    const check = await Partner.findById(partnerId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }
    await Partner.findByIdAndDelete(partnerId);

    return res.status(200).json({ success: true, message: "Partner deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMultiplePartners = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;

    await Partner.deleteMany({ _id: { $in: ids } });

    const remainingPartners = await Partner.find({});

    return res.status(200).json({ success: true, data: remainingPartners });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePartners = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }

    const { partnerId } = req.params;
    const check = await Partner.findById(partnerId);

    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    const { name, description } = req.body;

    let logo = check.logo; // Default to the previous logo

    if (req.file) {
      const relativePath = file.location.replace(/.*\/uploads/, "/uploads");
      logo = relativePath;
    }

    await Partner.findOneAndUpdate(
      { _id: partnerId },
      {
        name,
        description,
        logo, // Include the logo (either the new one or the previous one)
      }
    );

    return res.status(200).json({ success: true, message: "Partner updated" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
