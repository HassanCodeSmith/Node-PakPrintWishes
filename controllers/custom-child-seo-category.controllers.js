const CustomChildSeoCategoryModel = require("../models/custom-child-seo-category.model");

/**
 * Create Custom Child Seo Category
 */
exports.createCustomChildSeoCategory = async (req, res) => {
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
    const addedCustomChildSeoCategory =
      await CustomChildSeoCategoryModel.create({
        ...req.body,
        createdBy: userId,
      });
    console.log("Custom child seo category added successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom child seo category added successfully.",
      data: addedCustomChildSeoCategory,
    });
  } catch (error) {
    console.log(`createCustomChildSeoCategory - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Custom Child Seo Categories
 */
exports.getAllCustomChildSeoCategories = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allCustomChildSeoCategories = await CustomChildSeoCategoryModel.find({
      permanentDeleted: false,
    }).populate("customChildCategoryId");

    if (allCustomChildSeoCategories.length === 0) {
      console.log(`Custom child seo categories list is empty.`);
      return res.status(200).json({
        success: true,
        message: `Custom child seo categories list is empty.`,
        data: allCustomChildSeoCategories,
      });
    }
    console.log(
      "All Custom Child Seo Categories: ",
      allCustomChildSeoCategories
    );
    return res.status(200).json({
      success: true,
      data: allCustomChildSeoCategories,
    });
  } catch (error) {
    console.log(`getAllCustomChildSeoCategories - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Custom Child Seo Category by Id
 */
exports.getCustomChildSeoCategoryById = async (req, res) => {
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
    const customChildSeoCategory = await CustomChildSeoCategoryModel.find({
      customChildCategoryId: id,
    })
      .populate("customChildCategoryId")
      .populate("createdBy");
    if (!customChildSeoCategory) {
      console.log(`There is no any custom child seo category with provided id`);
      return res.status(400).json({
        success: false,
        message: `There is no any custom child seo category with provided id`,
      });
    }

    if (customChildSeoCategory.permanentDeleted === true) {
      console.log(`This category has been deleted.`);
      return res.status(400).json({
        success: false,
        message: `This category has been deleted.`,
      });
    }
    console.log("Custom Child Seo Category: ", customChildSeoCategory);
    return res.status(200).json({
      success: true,
      data: customChildSeoCategory,
    });
  } catch (error) {
    console.log(`getCustomChildSeoCategoryById - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Custom Child Seo Category by Id
 */
exports.updateCustomChildSeoCategoryById = async (req, res) => {
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
    const customChildSeoCategory = await CustomChildSeoCategoryModel.findById(
      id
    );
    if (!customChildSeoCategory) {
      console.log(`There is no any custom child seo category with provided id`);
      return res.status(400).json({
        success: false,
        message: `There is no any custom child seo category with provided id`,
      });
    }

    if (customChildSeoCategory.permanentDeleted === true) {
      console.log(`This category is deleted by admin`);
      return res.status(400).json({
        success: false,
        message: `This category is deleted by admin`,
      });
    }

    let updateFields = {};

    if (req.body.customChildCategoryId) {
      updateFields.customChildCategoryId = req.body.customChildCategoryId;
    } else {
      updateFields.customChildCategoryId =
        customChildSeoCategory.customChildCategoryId;
    }

    if (req.body.webTitle) {
      updateFields.webTitle = req.body.webTitle;
    } else {
      updateFields.webTitle = customChildSeoCategory.webTitle;
    }

    if (req.body.webDescription) {
      updateFields.webDescription = req.body.webDescription;
    } else {
      updateFields.webDescription = customChildSeoCategory.webDescription;
    }

    const updatedCustomChildCategory =
      await CustomChildSeoCategoryModel.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
    console.log("Custom child seo category updated successfully");
    return res.status(200).json({
      success: true,
      message: "Custom child seo category updated successfully",
      data: updatedCustomChildCategory,
    });
  } catch (error) {
    console.log(`updateCustomChildSeoCategoryById - catch - ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Custom Child Seo Category by Id
 */
exports.deleteCustomChildSeoCategoryById = async (req, res) => {
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
    const customChildSeoCategory = await CustomChildSeoCategoryModel.findById(
      id
    );
    if (!customChildSeoCategory) {
      console.log(`There is no any custom child seo category with provided id`);
      return res.status(400).json({
        success: false,
        message: `There is no any custom child seo category with provided id`,
      });
    }

    if (customChildSeoCategory.permanentDeleted === true) {
      console.log(`This category is already deleted by admin`);
      return res.status(400).json({
        success: false,
        message: `This category is already deleted by admin`,
      });
    }

    const deletedCustomChildSeoCategory =
      await CustomChildSeoCategoryModel.findByIdAndUpdate(
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
      data: deletedCustomChildSeoCategory,
    });
  } catch (error) {
    console.log(`deleteCustomChildSeoCategoryById - catch - ${error.message}`);
    return res.status(400).json({
      success: true,
      message: error.message,
    });
  }
};
