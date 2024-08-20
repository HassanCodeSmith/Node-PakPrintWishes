const SubCategory = require("../models/sub_Category");
const { StatusCodes } = require("http-status-codes");

exports.createsubCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      name,
      parent_id,
      category_description,
      category_image,
      categoryType,
    } = req.body;
    console.log(req.body);
    if (!name || !category_description || !parent_id) {
      return res.status(400).json({ message: "Fill All the Require Fields" });
    }

    // if (req.file) {
    //   const category_image = "/" + req.file.path;

    let status = false;

    if (req.role?.toLowerCase() == "admin") {
      status = true;
    }

    const newCategory = await SubCategory.create({
      name,
      category_description,
      parent_id,
      category_image,
      createdBy: userId,
      status,
      categoryType,
    });
    const findCategory = await SubCategory.findById(newCategory._id).populate(
      "parent_id"
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, data: findCategory });
    // {
    //   return res.status(400).json({ message: "Please upload an image" });
    // }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getallSubCategory = async (req, res) => {
  try {
    let params = {
      permanentDeleted: false,
    };
    req.role !== "admin" ? (params.createdBy = req.user.userId) : null;

    const data = await SubCategory.find(params)
      .populate("parent_id")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getallSubCategoryPublic = async (req, res) => {
  try {
    const { parentId } = req.params;
    const data = await SubCategory.find({
      status: { $ne: false },
      parent_id: parentId,
      permanentDeleted: false,
      // categoryType: "product",
    }).populate("parent_id");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { subId } = req.params;

    const findCategory = await SubCategory.findById(subId);
    if (!findCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Sub Category not found" });
    }
    switch (req.role) {
      case "admin":
        await SubCategory.findByIdAndUpdate(subId, { permanentDeleted: true });
        break;
      case "vendor":
        if (req.user.userId.toString() === findCategory.createdBy.toString()) {
          await SubCategory.findByIdAndUpdate(subId, {
            permanentDeleted: true,
          });
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to remove this category",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to remove this category",
        });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory successfully deleted",
      id: subId,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMultipleSubCategory = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;

    await SubCategory.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          permanentDeleted: true,
        },
      }
    );

    const remainSubCategory = await SubCategory.find({
      permanentDeleted: false,
    }).populate("parent_id");

    return res.status(200).json({
      success: true,
      message: "Deleted multiple sub categories.",
      data: remainSubCategory,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { subId } = req.params;
    const {
      name,
      parent_id,
      category_description,
      category_image,
      categoryType,
    } = req.body;

    const findCategory = await SubCategory.findById(subId);
    if (!findCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Sub Category not found" });
    }
    switch (req.role) {
      case "admin":
        await SubCategory.findOneAndUpdate(
          { _id: subId },
          { name, parent_id, category_description, category_image },
          { new: true }
        );
        break;
      case "vendor":
        if (req.user.userId.toString() === findCategory.createdBy.toString()) {
          await SubCategory.findOneAndUpdate(
            { _id: subId },
            {
              name,
              parent_id,
              category_description,
              category_image,
              categoryType,
            },
            { new: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to update this category",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this category",
        });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory successfully updated",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyCategory = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Access Denied." });
    }
    const { categoryId } = req.body;
    const check = await SubCategory.findById(categoryId);

    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    const updatedCategory = await SubCategory.findByIdAndUpdate(categoryId, {
      status: !check.status,
    });
    res
      .status(200)
      .json({ success: true, message: "Category verified successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSubCategoriesWithCategoryType = async (req, res) => {
  try {
    const role = req.role;
    if (role !== "admin" && role !== "vendor") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { categoryType } = req.params;

    const subCategories = await SubCategory.find({
      permanentDeleted: false,
      categoryType,
    });

    if (subCategories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Sub categories list is empty",
        data: subCategories,
      });
    }

    return res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
