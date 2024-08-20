const CustomParentCategoryModel = require("../models/custom-parent-category.model");

/**
 * Create Custom Parent Category
 */
exports.createCustomParentCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    if (req.file) {
      const customParentCategoryImage = req?.file?.location?.replace(
        /.*\/uploads/,
        "/uploads"
      );
      const customParentCategoryWithImage = await createCategoryWithImage(
        req.body,
        customParentCategoryImage,
        userId
      );
      console.log("Custom parent category created successfully with image");
      return res.status(200).json({
        success: true,
        message: "Custom parent category created successfully with image",
        data: customParentCategoryWithImage,
      });
    }
    const customParentCategory = await CustomParentCategoryModel.create({
      ...req.body,
      createdBy: userId,
    });
    console.log("Custom parent category created successfully");
    return res.status(200).json({
      success: true,
      message: "Custom parent category created successfully",
      data: customParentCategory,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategoryWithImage = async (body, image, userId) => {
  try {
    return await CustomParentCategoryModel.create({
      ...body,
      customParentCategoryImage: image,
      createdBy: userId,
    });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

/**
 * Get All Custom Parent Categories
 */
exports.getAllCustomParentCategories = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allCustomCategories = await CustomParentCategoryModel.find({
      permanentDeleted: false,
    });

    if (allCustomCategories.length === 0) {
      console.log("Custom parent category list is empty.");
      return res.status(200).json({
        success: true,
        message: "Custom parent category list is empty.",
      });
    }

    res.status(200).json({
      success: true,
      data: allCustomCategories,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Custom Parent Category by Id
 */
exports.getCustomParentCategoryById = async (req, res) => {
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

    const customCategory = await CustomParentCategoryModel.findById(
      id
    ).populate("createdBy");

    if (!customCategory) {
      console.log("There is no any custom parent category with provided id");
      return res.status(400).json({
        success: false,
        message: "There is no any custom parent category with provided id",
      });
    }

    if (customCategory.permanentDeleted === true) {
      console.log("Custom parent category with provided id has been deleted");
      return res.status(400).json({
        success: false,
        message: "Custom parent category with provided id has been deleted",
      });
    }

    res.status(200).json({
      success: true,
      data: customCategory,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Custom Parent Category by Id
 */

exports.updateCustomParentCategoryById = async (req, res) => {
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
    const isExist = await CustomParentCategoryModel.findById(id);

    if (!isExist) {
      console.log("Invalid user id");
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    if (isExist.permanentDeleted === true) {
      console.log("This custom parent category is deleted by admin");
      return res.status(400).json({
        success: false,
        message: "This custom parent category is deleted by admin",
      });
    }

    let updateFields = {};
    if (req.body.title) {
      updateFields.title = req.body.title;
    } else {
      updateFields.title = isExist.title;
    }

    if (req.body.description) {
      updateFields.description = req.body.description;
    } else {
      updateFields.description = isExist.description;
    }

    if (req.file) {
      const customParentCategoryImage = req?.file?.location?.replace(
        /.*\/uploads/,
        "/uploads"
      );
      updateFields.customParentCategoryImage = customParentCategoryImage;
    }
    if (!req.body.title && !req.body.description && !req.file) {
      console.log("Must be provide at least one update input field.");
      return res.status(400).json({
        success: false,
        message: "Must be provide at least one update input field.",
      });
    }
    const updatedCustomParentCategory =
      await CustomParentCategoryModel.findByIdAndUpdate(id, updateFields);

    console.log("Custom parent category updated successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom parent category updated successfully.",
      data: updatedCustomParentCategory,
    });
  } catch (error) {
    console.log(
      `Error: updateCustomParentCategoryById - catch ${error.message}`
    );
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Custom Parent Category by Id
 */
exports.deleteCustomParentCategoryById = async (req, res) => {
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
    const customCategory = await CustomParentCategoryModel.findById(id);
    if (!customCategory) {
      console.log("There is no any custom parent category with provided id");
      return res.status(200).json({
        success: false,
        message: "There is no any custom parent category with provided id",
      });
    }

    if (customCategory.permanentDeleted === true) {
      console.log(
        "Custom parent category with provided id already has been deleted"
      );
      return res.status(200).json({
        success: false,
        message:
          "Custom parent category with provided id already has been deleted",
      });
    }

    await CustomParentCategoryModel.findByIdAndUpdate(id, {
      permanentDeleted: true,
    });
    console.log("Custom parent category has been deleted");
    return res.status(200).json({
      success: false,
      message: "Custom parent category has been deleted",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Change Custom Parent Category Status
 */
exports.changeCustomParentCategoryStatus = async (req, res) => {
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

    const customParentCategory = await CustomParentCategoryModel.findById(id);

    if (!customParentCategory) {
      console.log("Invalid id");
      return res.status(200).json({
        success: false,
        message: "Invalid id",
      });
    }

    if (customParentCategory.permanentDeleted === true) {
      console.log("This category is deleted - So you can't change its status");
      return res.status(200).json({
        success: false,
        message: "This category is deleted - So you can't change its status",
      });
    }

    let statusValue;
    if (customParentCategory.status === true) {
      statusValue = false;
    } else {
      statusValue = true;
    }

    const statusUpdatedCustomParentCategory =
      await CustomParentCategoryModel.findByIdAndUpdate(
        id,
        {
          status: statusValue,
        },
        { new: true }
      );

    console.log("Custom parent category status changed successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom parent category status changed successfully.",
      data: statusUpdatedCustomParentCategory,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
