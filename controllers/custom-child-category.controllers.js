const CustomChildCategoryModel = require("../models/custom-child-category.model");

/**
 * Create Custom Child Category
 */
exports.createCustomChildCategory = async (req, res) => {
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
    if (!req.body.customParentCategoryIds) {
      console.log("Custom Parent Category Id/Ids must be provided");
      return res.status(400).json({
        success: false,
        message: "Custom Parent Category Id/Ids must be provided",
      });
    }
    if (req.file) {
      const customChildCategoryImage = req?.file?.location?.replace(
        /.*\/uploads/,
        "/uploads"
      );

      const customChildCategory = await createCategoryWithImage(
        req.body,
        customChildCategoryImage,
        userId
      );
      console.log("Custom child category created successfully with image");
      return res.status(200).json({
        success: true,
        message: "Custom child category created successfully with image",
        data: customChildCategory,
      });
    }
    const customChildCategory = await CustomChildCategoryModel.create({
      ...req.body,
      createdBy: userId,
    });
    console.log("Custom child category added successfully");
    return res.status(200).json({
      success: true,
      message: "Custom child category added successfully",
      data: customChildCategory,
    });
  } catch (error) {
    console.log(
      `handleCreateCustomChildCategoryModel - catch - ${error.message}`
    );
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategoryWithImage = async (body, image, userId) => {
  try {
    return await CustomChildCategoryModel.create({
      ...body,
      customChildCategoryImage: image,
      createdBy: userId,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get All Custom Child Categories
 */
exports.getAllCustomChildCategories = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    const allCustomCategories = await CustomChildCategoryModel.find({
      permanentDeleted: false,
    }).populate("customParentCategoryIds");

    if (allCustomCategories.length === 0) {
      console.log("Custom child category list is empty");
      return res.status(200).json({
        success: true,
        message: "Custom child category list is empty",
        data: allCustomCategories,
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
 * Get Custom Child Category by Id
 */
exports.getCustomChildCategoryById = async (req, res) => {
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

    const customCategory = await CustomChildCategoryModel.findById(id)
      .populate("createdBy", "first_name last_name email role")
      // nested population
      .populate({
        path: "customParentCategoryIds",
        // populate: {
        //   path: "createdBy",
        // },
      });

    if (!customCategory) {
      console.log("There is no any custom child category with provided id");
      return res.status(400).json({
        success: false,
        message: "There is no any custom child category with provided id",
      });
    }

    if (customCategory.permanentDeleted === true) {
      console.log("Custom child category with provided id has been deleted");
      return res.status(400).json({
        success: false,
        message: "Custom child category with provided id has been deleted",
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
 * Update Custom Child Category by Id
 */
exports.updateCustomChildCategoryById = async (req, res) => {
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
    const isExist = await CustomChildCategoryModel.findById(id);

    if (!isExist) {
      console.log("Invalid user id");
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    if (isExist.permanentDeleted === true) {
      console.log("This custom parent category is deleted");
      return res.status(400).json({
        success: false,
        message: "This custom parent category is deleted",
      });
    }

    let updateFields = {};
    if (req.body.title) {
      updateFields.title = req.body.title;
    } else {
      updateFields.title = isExist.title;
    }

    if (req.body.customParentCategoryIds) {
      updateFields.customParentCategoryIds = req.body.customParentCategoryIds;
    } else {
      updateFields.customParentCategoryIds = isExist.customParentCategoryIds;
    }

    if (req.body.description) {
      updateFields.description = req.body.description;
    } else {
      updateFields.description = isExist.description;
    }

    if (req.file) {
      const customChildCategoryImage = req?.file?.location?.replace(
        /.*\/uploads/,
        "/uploads"
      );
      updateFields.customChildCategoryImage = customChildCategoryImage;
    }
    if (!req.body.title && !req.body.description && !req.file) {
      console.log("Must be provide at least one update input field.");
      return res.status(400).json({
        success: false,
        message: "Must be provide at least one update input field.",
      });
    }
    const updatedCustomChildCategory =
      await CustomChildCategoryModel.findByIdAndUpdate(id, updateFields);

    console.log("Custom Child category updated successfully.");
    return res.status(200).json({
      success: true,
      message: "Custom Child category updated successfully.",
      data: updatedCustomChildCategory,
    });
  } catch (error) {
    console.log(
      `Error: updateCustomChildCategoryById - catch ${error.message}`
    );
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Custom Child Category by Id
 */
exports.deleteCustomChildCategoryById = async (req, res) => {
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
    const customCategory = await CustomChildCategoryModel.findById(id);
    if (!customCategory) {
      console.log("There is no any custom child category with provided id");
      return res.status(400).json({
        success: false,
        message: "There is no any custom child category with provided id",
      });
    }

    if (customCategory.permanentDeleted === true) {
      console.log(
        "Custom child category with provided id already has been deleted"
      );
      return res.status(400).json({
        success: false,
        message:
          "Custom child category with provided id already has been deleted",
      });
    }

    const deletedCustomChildCategory =
      await CustomChildCategoryModel.findByIdAndUpdate(
        id,
        {
          permanentDeleted: true,
        },
        { new: true }
      );
    console.log("Custom child category has been deleted");
    return res.status(200).json({
      success: false,
      message: "Custom child category has been deleted",
      data: deletedCustomChildCategory,
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
 * Change Custom Child Category Status
 */
exports.changeCustomChildCategoryStatus = async (req, res) => {
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

    const customChildCategory = await CustomChildCategoryModel.findById(id);

    if (!customChildCategory) {
      console.log("Invalid id");
      return res.status(200).json({
        success: false,
        message: "Invalid id",
      });
    }

    if (customChildCategory.permanentDeleted === true) {
      console.log("This category is deleted - So you can't change its status");
      return res.status(200).json({
        success: false,
        message: "This category is deleted - So you can't change its status",
      });
    }

    let statusValue;
    if (customChildCategory.status === true) {
      statusValue = false;
    } else {
      statusValue = true;
    }

    const statusUpdatedCustomChildCategory =
      await CustomChildCategoryModel.findByIdAndUpdate(
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
      data: statusUpdatedCustomChildCategory,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
