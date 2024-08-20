const InquiryFormModel = require("../models/inquiry-form.model");

/**
 * Create Inquiry Form
 */
exports.createInquiryForm = async (req, res) => {
  try {
    const { userId } = req.user;
    await InquiryFormModel.create({ ...req.body, createdBy: userId });
    return res.status(200).json({
      success: true,
      message: "Inquiry Form Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get All Inquiry Forms
 */
exports.getAllInquiryForms = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const inquiryForms = await InquiryFormModel.find({
      permanentDeleted: false,
    });

    if (inquiryForms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Inquiry forms list is empty",
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiryForms,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get Inquiry Form By Id
 */
exports.getInquiryFormById = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    const inquiryForm = await InquiryFormModel.findById(id, {
      permanentDeleted: false,
    });

    if (!inquiryForm) {
      return res.status(200).json({
        success: false,
        message: "Inquiry form not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiryForm,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete Inquiry Form
 */

exports.deleteInquiryForm = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    const inquiryForm = await InquiryFormModel.findById(id, {
      permanentDeleted: false,
    });

    if (!inquiryForm) {
      return res.status(200).json({
        success: false,
        message: "Inquiry form not found",
      });
    }

    await InquiryFormModel.findByIdAndUpdate(id, {
      permanentDeleted: true,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry form deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Change Status For Inquiry Form
 */
exports.changeInquiryFormStatus = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    const inquiryForm = await InquiryFormModel.findById(id, {
      permanentDeleted: false,
    });

    if (!inquiryForm) {
      return res.status(200).json({
        success: false,
        message: "Inquiry form not found",
      });
    }

    let inquiryFormStatus;

    if (inquiryForm.status === true) {
      inquiryFormStatus = false;
    } else {
      inquiryFormStatus = true;
    }
    await InquiryFormModel.findByIdAndUpdate(id, {
      status: inquiryFormStatus,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry form status changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
