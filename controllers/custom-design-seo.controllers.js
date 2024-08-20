const CustomDesignSeoModel = require("../models/custom-design-seo.model");

/**
 * Create Custom Design Seo
 */
exports.createCustomDesignSeo = async (req, res) => {
  try {
    const { userId } = req.user;
    const userRole = req.role;

    console.log("userId", userId);
    console.log("userRole", userRole);

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    console.log("seoooooooooooooooooo", req.body);
    const addedCustomDesignSeo = await CustomDesignSeoModel.create({
      ...req.body,
      createdBy: userId,
    });
    console.log("Custom design seo added successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom design seo added successfully.",
      data: addedCustomDesignSeo,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Custom Design Seos
 */
exports.getAllCustomDesignSeos = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allCustomDesignSeos = await CustomDesignSeoModel.find({
      permanentDeleted: false,
    }).populate("customDesignId");

    if (allCustomDesignSeos.length === 0) {
      console.log(`Custom design seo list is empty.`);
      return res.status(200).json({
        success: true,
        message: `Custom design seo list is empty.`,
        data: allCustomDesignSeos,
      });
    }
    console.log("All Custom Design Seo Categories: ", allCustomDesignSeos);
    return res.status(200).json({
      success: true,
      data: allCustomDesignSeos,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Custom Design Seo by Id
 */
exports.getCustomDesignSeoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const customDesignSeo = await CustomDesignSeoModel.find({
      customDesignId: id,
    })
      .populate("customDesignId")
      .populate("createdBy", "first_name last_name email");
    if (!customDesignSeo) {
      console.log(`There is no any custom design seo with provided id`);
      return res.status(400).json({
        success: false,
        message: `There is no any custom design seo with provided id`,
      });
    }

    if (customDesignSeo.permanentDeleted === true) {
      console.log(`This custom design has been deleted.`);
      return res.status(400).json({
        success: false,
        message: `This custom design has been deleted.`,
      });
    }
    console.log("Custom Design: ", customDesignSeo);
    return res.status(200).json({
      success: true,
      data: customDesignSeo,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Custom Design Seo by Id
 */
exports.updateCustomDesignSeoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const customDesignSeo = await CustomDesignSeoModel.findById(id);
    if (!customDesignSeo) {
      console.log(`There is no any custom design seo with provided id`);
      return res.status(400).json({
        success: false,
        message: `There is no any custom design seo with provided id`,
      });
    }

    if (customDesignSeo.permanentDeleted === true) {
      console.log(`This category is deleted by admin`);
      return res.status(400).json({
        success: false,
        message: `This category is deleted by admin`,
      });
    }

    let updateFields = {};

    if (req.body.customDesignId) {
      updateFields.customDesignId = req.body.customDesignId;
    } else {
      updateFields.customDesignId = customDesignSeo.customDesignId;
    }

    if (req.body.webTitle) {
      updateFields.webTitle = req.body.webTitle;
    } else {
      updateFields.webTitle = customDesignSeo.webTitle;
    }

    if (req.body.webDescription) {
      updateFields.webDescription = req.body.webDescription;
    } else {
      updateFields.webDescription = customDesignSeo.webDescription;
    }

    const updatedCustomDesignSeo = await CustomDesignSeoModel.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      }
    );
    console.log("Custom child seo category updated successfully");
    return res.status(200).json({
      success: true,
      message: "Custom child seo category updated successfully",
      data: updatedCustomDesignSeo,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Custom Design Seo by Id
 */
exports.deleteCustomDesignSeoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const customDesignSeo = await CustomDesignSeoModel.findById(id);
    if (!customDesignSeo) {
      console.log(`There is no any custom design seo with provided id`);
      return res.status(400).json({
        success: false,
        message: `There is no any custom design seo with provided id`,
      });
    }

    if (customDesignSeo.permanentDeleted === true) {
      console.log(`This custom design is already by ${userRole}`);
      return res.status(400).json({
        success: false,
        message: `This custom design is already by ${userRole}`,
      });
    }

    const deletedCustomDesignSeo = await CustomDesignSeoModel.findByIdAndUpdate(
      id,
      {
        permanentDeleted: true,
      },
      { new: true }
    );
    console.log(`Custom child seo category deleted successfully.`);
    return res.status(200).json({
      success: true,
      message: `Custom child seo category deleted successfully.`,
      data: deletedCustomDesignSeo,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
