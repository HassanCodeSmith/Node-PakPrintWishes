const Accessories = require("../models/accessories");

exports.addAccessories = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      parentCatagory,
      category,
      brand,
      price,
      condition,
      location,
      title,
      description,
      customFields,
    } = req.body;

    if (
      !(
        parentCatagory ||
        category ||
        price ||
        condition ||
        location ||
        title ||
        description
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Required Fields",
      });
    }

    if (!req.files) {
      return res
        .status(400)
        .json({ success: false, message: "Please Select At Least 1 Image" });
    } else {
      if (req.files.length > 16) {
        return res.status(400).json({
          success: false,
          message: "You can select a maximum of 16 images",
        });
      }

      const imagePaths = req.files.map((file) =>
        file.location.replace(/.*\/uploads/, "/uploads")
      );

      const accessories = await Accessories.create({
        category,
        brand,
        price,
        condition,
        location,
        title,
        description,
        createdBy: userId,
        customFields: JSON.parse(customFields),
        images: imagePaths,
      });

      return res.status(200).json({ success: true, data: accessories });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAccessories = async (req, res) => {
  try {
    const accessories = await Accessories.find({ permanentDeleted: false });
    if (!accessories) {
      return res
        .status(400)
        .json({ success: false, message: "No Accessories Found" });
    }
    return res.status(200).json({ success: true, data: accessories });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAccessory = async (req, res) => {
  try {
    const { accessoryId } = req.params;
    const accessory = await Accessories.findOne({
      _id: accessoryId,
      permanentDeleted: false,
    });
    if (!accessory) {
      return res
        .status(400)
        .json({ success: false, message: "No Accessory By This Id" });
    }
    return res.status(200).json({ success: true, data: accessory });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAccessory = async (req, res) => {
  try {
    const { accessoryId } = req.params;
    console.log(accessoryId);
    const {
      category,
      brand,
      price,
      condition,
      location,
      title,
      description,
      customFields,
    } = req.body;
    const accessory = await Accessories.findOne({
      _id: accessoryId,
      permanentDeleted: false,
    });
    if (!accessory) {
      return res
        .status(400)
        .json({ success: false, message: "No Accessory With Given Id" });
    }
    if (req.files) {
      const imagePaths = req.files.map((file) =>
        file.location.replace(/.*\/uploads/, "/uploads")
      );
      await Accessories.findByIdAndUpdate(accessoryId, {
        category,
        brand,
        price,
        condition,
        location,
        title,
        description,
        customFields,
        images: imagePaths,
      });
      return res
        .status(200)
        .json({ success: true, message: "Accessory Updated Successfully" });
    }
    await Accessories.findByIdAndUpdate(accessoryId, {
      category,
      brand,
      price,
      condition,
      location,
      title,
      description,
      customFields,
    });
    return res
      .status(200)
      .json({ success: true, message: "Accessory Updated Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAccessory = async (req, res) => {
  try {
    const { accessoryId } = req.params;
    const accessory = await Accessories.findOne({
      _id: accessoryId,
      permanentDeleted: false,
    });
    if (!accessory) {
      return res
        .status(400)
        .json({ success: false, message: "No Accessory With Given Id" });
    }
    await Accessories.findByIdAndUpdate(accessoryId, {
      permanentDeleted: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Accessory Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
