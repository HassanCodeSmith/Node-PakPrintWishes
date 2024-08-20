const CustomParentSeoCategoryModel = require("../models/custom-parent-seo-category.model");

/**
 * Create Custom Parent Seo Category
 */
exports.createCustomParentSeoCategory = async (req, res) => {
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
    const addedCustomParentSeoCategory =
      await CustomParentSeoCategoryModel.create({
        ...req.body,
        createdBy: userId,
      });
    console.log("Custom parent seo category added successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom parent seo category added successfully.",
      data: addedCustomParentSeoCategory,
    });
  } catch (error) {
    console.log(`createCustomParentSeoCategory - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Custom Parent Seo Categories
 */
exports.getAllCustomParentSeoCategories = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allCustomParentSeoCategories =
      await CustomParentSeoCategoryModel.find({
        permanentDeleted: false,
      }).populate("customParentCategoryId");

    if (allCustomParentSeoCategories.length === 0) {
      console.log(`Custom parent seo categories list is empty.`);
      return res.status(200).json({
        success: true,
        message: `Custom parent seo categories list is empty.`,
        data: allCustomParentSeoCategories,
      });
    }
    console.log(
      "All Custom Parent Seo Categories: ",
      allCustomParentSeoCategories
    );
    return res.status(200).json({
      success: true,
      data: allCustomParentSeoCategories,
    });
  } catch (error) {
    console.log(`getAllCustomParentSeoCategories - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Custom Parent Seo Category by Id
 */
exports.getCustomParentSeoCategoryById = async (req, res) => {
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
    const customParentSeoCategory = await CustomParentSeoCategoryModel.find({
      customParentCategoryId: id,
    })
      .populate("customParentCategoryId")
      .populate("createdBy");
    if (!customParentSeoCategory) {
      console.log(
        `There is no any custom parent seo category with provided id`
      );
      return res.status(400).json({
        success: false,
        message: `There is no any custom parent seo category with provided id`,
      });
    }

    if (customParentSeoCategory.permanentDeleted === true) {
      console.log(`This category has been deleted.`);
      return res.status(400).json({
        success: false,
        message: `This category has been deleted.`,
      });
    }
    console.log("Custom Parent Seo Category: ", customParentSeoCategory);
    return res.status(200).json({
      success: true,
      data: customParentSeoCategory,
    });
  } catch (error) {
    console.log(`getCustomParentSeoCategoryById - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Custom Parent Seo Category by Id
 */
exports.updateCustomParentSeoCategoryById = async (req, res) => {
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
    const customParentSeoCategory = await CustomParentSeoCategoryModel.findById(
      id
    );
    if (!customParentSeoCategory) {
      console.log(
        `There is no any custom parent seo category with provided id`
      );
      return res.status(400).json({
        success: false,
        message: `There is no any custom parent seo category with provided id`,
      });
    }

    if (customParentSeoCategory.permanentDeleted === true) {
      console.log(`This category is deleted by admin`);
      return res.status(400).json({
        success: false,
        message: `This category is deleted by admin`,
      });
    }

    let updateFields = {};

    if (req.body.customParentCategoryId) {
      updateFields.customParentCategoryId = req.body.customParentCategoryId;
    } else {
      updateFields.customParentCategoryId =
        customParentSeoCategory.customParentCategoryId;
    }

    if (req.body.webTitle) {
      updateFields.webTitle = req.body.webTitle;
    } else {
      updateFields.webTitle = customParentSeoCategory.webTitle;
    }

    if (req.body.webDescription) {
      updateFields.webDescription = req.body.webDescription;
    } else {
      updateFields.webDescription = customParentSeoCategory.webDescription;
    }

    const updatedCustomParentCategory =
      await CustomParentSeoCategoryModel.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
    console.log("Custom parent seo category updated successfully");
    return res.status(200).json({
      success: true,
      message: "Custom parent seo category updated successfully",
      data: updatedCustomParentCategory,
    });
  } catch (error) {
    console.log(`updateCustomParentSeoCategoryById - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Custom Parent Seo Category by Id
 */
exports.deleteCustomParentSeoCategoryById = async (req, res) => {
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
    const customParentSeoCategory = await CustomParentSeoCategoryModel.findById(
      id
    );
    if (!customParentSeoCategory) {
      console.log(
        `There is no any custom parent seo category with provided id`
      );
      return res.status(400).json({
        success: false,
        message: `There is no any custom parent seo category with provided id`,
      });
    }

    if (customParentSeoCategory.permanentDeleted === true) {
      console.log(`This category is already deleted by admin`);
      return res.status(400).json({
        success: false,
        message: `This category is already deleted by admin`,
      });
    }

    const deletedCustomParentSeoCategory =
      await CustomParentSeoCategoryModel.findByIdAndUpdate(
        id,
        {
          permanentDeleted: true,
        },
        { new: true }
      );
    console.log(`Custom parent seo category deleted successfully.`);
    return res.status(200).json({
      success: true,
      message: `Custom parent seo category deleted successfully.`,
      data: deletedCustomParentSeoCategory,
    });
  } catch (error) {
    console.log(`deleteCustomParentSeoCategoryById - catch - ${error.message}`);
    return res.status(400).json({
      success: true,
      message: error.message,
    });
  }
};
