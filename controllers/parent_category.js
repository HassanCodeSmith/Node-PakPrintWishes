const ParentCategory = require("../models/parent_category");
const SubCategory = require("../models/sub_Category");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Notification = require("../models/notification");
const parentCatagoryMail = require("../templates/parentCategory");
const sendEmail = require("../utils/sendEmail");

exports.getCategoryDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ParentCategory.findById(id);
    // console.log("category: " + category);
    if (category) {
      return res.status(200).json({ success: true, data: category });
    }
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "No Category Found" });
    }

    return res.status(200).json({ success: true, data: subCategory });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.createParentCategory = async (req, res) => {
  try {
    const { name, category_description, categoryType } = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!name || !category_description) {
      return res
        .status(400)
        .json({ message: "Please provide a name and a category description" });
    }

    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");
      const category_image = relativePath;

      let status = false;

      if (req.role?.toLowerCase() === "admin") {
        status = true;
      } else if (req.role?.toLowerCase() === "vendor") {
        status = false;
      }

      const newCategory = await ParentCategory.create({
        name,
        category_description,
        category_image,
        createdBy: userId,
        status,
        categoryType,
      });

      if (req.role?.toLowerCase() === "vendor") {
        const admins = await User.find({ role: "admin" });

        admins.forEach(async (admin) => {
          const adminTemplate = parentCatagoryMail(
            admin.first_name,
            user.first_name,
            user.email,
            newCategory.name
          );
          sendEmail({
            to: admin.email,
            subject: `${user.first_name} has submitted request to add a new parent category.`,
            html: adminTemplate,
          });
          const notification = await Notification.create({
            reciever: admin._id,
            userId: userId,
            id: newCategory._id.toString(),
            title: "New Parent Category.",
            body: `${user.first_name} has submitted request to add a new parent category.`,
            type: "parentCategory",
          });
          console.log(notification);
        });
      }

      return res
        .status(StatusCodes.CREATED)
        .json({ success: true, data: newCategory });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please provide category image." });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getParentCategory = async (req, res) => {
  try {
    let params = {
      permanentDeleted: false,
    };
    req.role !== "admin" ? (params.createdBy = req.user.userId) : null;

    const Parentcategory = await ParentCategory.find(params).sort({
      updatedAt: -1,
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: Parentcategory });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getParentCategoryFolders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    let Parentcategory;

    if (user.role === "vendor") {
      Parentcategory = await ParentCategory.find({
        status: { $ne: false },
        permanentDeleted: false,
        createdBy: userId,
      }).sort({ updatedAt: -1 });
    } else if (user.role === "admin") {
      Parentcategory = await ParentCategory.find({
        status: { $ne: false },
        permanentDeleted: false,
      })
        .populate("createdBy")
        .sort({ updatedAt: -1 });

      if (req.query.userType === "Admin") {
        Parentcategory = Parentcategory.filter(
          (item) => item.createdBy && item.createdBy.role === "admin"
        );
      } else if (req.query.userType === "Vendor") {
        Parentcategory = Parentcategory.filter(
          (item) => item.createdBy && item.createdBy.role === "vendor"
        );
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "You are not allowed!" });
    }

    const accessories = await ParentCategory.findOne({ type: "access" });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: [...Parentcategory, accessories] });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getParentCategoryPublic = async (req, res) => {
  try {
    const Parentcategory = await ParentCategory.find({
      status: { $ne: false },
      permanentDeleted: false,
      // categoryType: "product",
    }).sort({ updatedAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: Parentcategory });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateParentCategory = async (req, res) => {
  try {
    const { ParentCategoryId } = req.params;
    const { name, category_description, categoryType } = req.body;
    const check = await ParentCategory.findById(ParentCategoryId);

    if (!check) {
      return res.status(400).json({ message: "No Parent Category Found" });
    }

    let category_image = check.category_image;
    let status = false;

    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

      category_image = relativePath;

      if (req.role?.toLowerCase() === "admin") {
        status = true;
      }
    }

    if (
      req.role === "admin" ||
      (req.role === "vendor" &&
        req.user.userId.toString() === check.createdBy.toString())
    ) {
      await ParentCategory.findOneAndUpdate(
        { _id: ParentCategoryId },
        {
          name,
          category_description,
          category_image,
          categoryType,
        }
      );

      return res
        .status(200)
        .json({ success: true, message: "Parent Category updated." });
    } else {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this category",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteManyParentCategory = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ParentCategoryId } = req.body;
    // console.log(req.body);
    const deletedCategories = await ParentCategory.updateMany(
      {
        _id: { $in: ParentCategoryId },
      },
      {
        $set: { permanentDeleted: true },
      }
    );
    if (deletedCategories.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No Parent Categories found to delete",
      });
    }
    const allParentCat = await ParentCategory.find({});
    return res.status(200).json({
      success: true,
      message: "Parent Category Has been Deleted",
      data: allParentCat,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteParentCategory = async (req, res) => {
  try {
    const { ParentCategoryId } = req.params;
    const check = await ParentCategory.findById(ParentCategoryId);
    if (!check) {
      return res.status(400).json({ message: "No Parent Category Found" });
    }
    switch (req.role) {
      case "admin":
        await ParentCategory.updateOne(
          { _id: ParentCategoryId },
          { permanentDeleted: true }
        );
        break;
      case "vendor":
        if (req.user.userId.toString() === check.createdBy.toString()) {
          await ParentCategory.updateOne(
            { _id: ParentCategoryId },
            { permanentDeleted: true }
          );
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
    await ParentCategory.deleteOne({ _id: ParentCategoryId });

    return res.status(200).json({
      success: true,
      message: "Parent Category Deleted Successfully",
      id: ParentCategoryId,
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
    const check = await ParentCategory.findById(categoryId);

    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    const updatedCategory = await ParentCategory.findByIdAndUpdate(categoryId, {
      status: !check.status,
    });

    res
      .status(200)
      .json({ success: true, message: "Category verified successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateParentCatStatus = async (req, res) => {
  try {
    const { parentCategoryId } = req.params;
    const { status } = req.body;
    // if (!status) {
    //   return res.status(400).json({success:false,message:"Please Update Status"})
    // }

    const parent_Cat = await ParentCategory.findByIdAndUpdate(
      parentCategoryId,
      {
        status,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ success: true, data: parent_Cat });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getParentCategoriesWithCategoryType = async (req, res) => {
  try {
    const role = req.role;
    if (role !== "admin" && role !== "vendor") {
      console.log("Invalid user - ", role);
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { categoryType } = req.params;

    const parentCategories = await ParentCategory.find({
      permanentDeleted: false,
      categoryType,
    });

    if (parentCategories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Parent categories list is empty",
        data: parentCategories,
      });
    }

    return res.status(200).json({
      success: true,
      data: parentCategories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
