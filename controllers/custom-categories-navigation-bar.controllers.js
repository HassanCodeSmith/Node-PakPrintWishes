const CustomParentCategoryModel = require("../models/custom-parent-category.model");
const CustomChildCategoryModel = require("../models/custom-child-category.model");

exports.getCustomCategoriesNavigationBar = async (req, res) => {
  try {
    const customParentCategories = await CustomParentCategoryModel.find({
      permanentDeleted: false,
      status: true,
    });
    const customChildCategories = await CustomChildCategoryModel.find({
      permanentDeleted: false,
      status: true,
    }).populate("customParentCategoryIds");

    return res.status(200).json({
      success: false,
      customParentCategories,
      customChildCategories,
    });
  } catch (error) {
    console.log(error.messag);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
