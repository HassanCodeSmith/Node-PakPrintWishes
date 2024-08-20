const ChildSeo = require("../models/childCategorySeo");
const SubCategory = require("../models/sub_Category");

exports.addForSeo = async (req, res) => {
  try {
    const { category_id, web_title, web_description } = req.body;
    const Category = await SubCategory.findById(category_id);
    if (!Category) {
      return res.status(400).json({ success: false, message: "Wrong Id" });
    }

    await ChildSeo.create({ category_id, web_title, web_description });
    return res
      .status(200)
      .json({ success: true, message: "Child Category SEO Added." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await ChildSeo.find({})
      .populate("category_id")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ChildSeo.findOne({ category_id: id }).populate(
      "category_id"
    );
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.deleteSeo = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await ChildSeo.findById(id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    await ChildSeo.findByIdAndRemove(id);
    return res.status(200).json({ success: true, message: "Removed From Seo" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.updateSeo = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, web_title, web_description } = req.body;
    const check = await ChildSeo.findById(id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    await ChildSeo.findOneAndUpdate(
      { _id: id },
      { category_id, web_title, web_description },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Updated Sub Category SEO" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
