const Slider = require("../models/slider");
const ParentCategory = require("../models/parent_category");

exports.addSlider = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { userId } = req.user;
    const { parent_Id, sliderDescription, subTitle, title, url } = req.body;
    const check = await ParentCategory.findById(parent_Id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Category Found" });
    }
    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

      const sliderImage = relativePath;

      const slider = await Slider.create({
        parent_Id,
        title,
        sliderDescription,
        subTitle,
        url,
        sliderImage,
        createdBy: userId,
      });
      const newSlider = await Slider.findById(slider._id).populate("parent_Id");
      return res.status(200).json({ success: false, data: newSlider });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please provide image." });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSlider = async (req, res) => {
  try {
    // if (req.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Permission denied." });
    // }
    const sliderImages = await Slider.find({})
      .populate("parent_Id")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: sliderImages });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }

    const { sliderId } = req.params;
    const check = await Slider.findById(sliderId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Slider Not Found" });
    }
    let sliderImage = check.sliderImage;

    if (req.file) {
      // console.log(req.file);
      // console.log(">>>>>>>>>>", req.file.location);
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");
      sliderImage = relativePath;
    }

    const updatedSlider = await Slider.findOneAndUpdate(
      { _id: sliderId },
      { ...req.body, sliderImage },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Slider has been updated",
      data: updatedSlider,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { sliderId } = req.params;
    await Slider.findOneAndRemove({ _id: sliderId });

    const remainingSliders = await Slider.find({});
    return res.status(200).json({
      success: true,
      message: "SliderImage Has Been Deleted",
      // data: remainingSliders,
      id: sliderId,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.multipleDeleteSliders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    await Slider.deleteMany({ _id: { $in: ids } });
    const remainingSliders = await Slider.find({});
    return res.status(200).json({
      success: true,
      message: "SliderImage Has been deleted",
      data: remainingSliders,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
