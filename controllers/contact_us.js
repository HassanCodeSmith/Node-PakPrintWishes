const ContactUs = require("../models/contact_us");

exports.addMessage = async (req, res) => {
  try {
    const { email, name, message } = req.body;
    console.log(req.body);
    if (!email || !name || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }
    const contactUs = await ContactUs.create({
      email,
      name,
      message,
    });
    console.log({ contactUs });
    return res.status(200).json({
      message: "Message sent successfully",
      success: true,
      data: contactUs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const contactUs = await ContactUs.find({}).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: contactUs });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { id } = req.params;
    await ContactUs.findByIdAndRemove(id);
    return res.status(200).json({ success: true, id: id });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.deleteMessageMultiple = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    await ContactUs.deleteMany({ _id: { $in: ids } });
    const remainingContactUs = await ContactUs.find({});
    return res.status(200).json({ success: true, data: remainingContactUs });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
