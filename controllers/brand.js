const Brand = require("../models/brand");
const fs = require("fs");

exports.getAllBrand = async (req, res) => {
  try {
    const brands = await Brand.find({ permanentDeleted: false });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const { userId } = req.user;

    if (!name || !slug || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Provide All Required Fields" });
    }

    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

      const logo = relativePath;

      const newBrand = await Brand.create({
        name,
        slug,
        description,
        logo,
        createdBy: userId,
      });
      return res.status(200).json({ data: newBrand });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a brand image." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const check = await Brand.findById(brandId);

    if (!check) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }

    const { name, slug, description } = req.body;
    let logo = check.logo; // Default value

    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");
      logo = relativePath;
    }

    if (
      req.role === "admin" ||
      (req.role === "vendor" &&
        req.user.userId.toString() === check.createdBy.toString())
    ) {
      const updatedBrand = await Brand.findOneAndUpdate(
        { _id: brandId },
        { name, slug, description, logo },
        { new: true }
      );

      return res
        .status(200)
        .json({ success: true, message: "Updated", brand: updatedBrand });
    } else {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this brand.",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const check = await Brand.findById(brandId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "brand not found" });
    }
    switch (req.role) {
      case "admin":
        await Brand.findOneAndUpdate(
          { _id: brandId },
          { permanentDeleted: true }
        );
        break;
      case "vendor":
        if (req.user.userId.toString() === check.createdBy.toString()) {
          await Brand.findOneAndUpdate(
            { _id: brandId },
            { permanentDeleted: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to remove this brand.",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to remove this brand.",
        });
    }

    return res
      .status(200)
      .json({ message: "Brand Deleted....", success: true, id: brandId });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteManyBrand = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    await Brand.updateMany(
      { _id: { $in: ids } },
      { $set: { permanentDeleted: true } }
    );

    const remainingBrands = await Brand.find({ permanentDeleted: false });

    return res.status(200).json({
      success: true,
      message: "Deleted multiple brands.",
      data: remainingBrands,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
