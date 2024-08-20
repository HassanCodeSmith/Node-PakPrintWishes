const CatSeo = require("../models/parentCategorySeo");
const ParentCategory = require("../models/parent_category");

exports.addForSeo = async (req, res) => {
  try {
    const { category_id, web_title, web_description } = req.body;
    const Category = await ParentCategory.findById(category_id);
    if (!Category) {
      return res.status(400).json({ success: false, message: "Wrong Id" });
    }

    await CatSeo.create({ category_id, web_title, web_description });
    return res
      .status(200)
      .json({ success: true, message: "Parent Category SEO Added." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await CatSeo.find({})
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
    const data = await CatSeo.findOne({ category_id: id }).populate(
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
    const check = await CatSeo.findById(id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    await CatSeo.findByIdAndRemove(id);
    return res.status(200).json({ success: true, message: "Removed From Seo" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.updateSeo = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, web_title, web_description } = req.body;
    const check = await CatSeo.findById(id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    await CatSeo.findOneAndUpdate(
      { _id: id },
      { category_id, web_title, web_description },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Updated Parent Category SEO" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
