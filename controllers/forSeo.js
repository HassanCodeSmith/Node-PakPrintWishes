const ForSeo = require("../models/forSeo");
const Product = require("../models/product");

exports.addForSeo = async (req, res) => {
  try {
    const { product_id, web_title, web_description, productType } = req.body;
    console.log(req.body);
    const check = await Product.findById(product_id);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "No Product with Given Id",
      });
    }
    const seo = await ForSeo.create({
      product_id,
      web_description,
      web_title,
      productType,
    });
    return res
      .status(200)
      .json({ success: true, message: "Product has been Added" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await ForSeo.find({})
      .populate("product_id")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ForSeo.findOne({ product_id: id }).populate(
      "product_id"
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
    const check = await ForSeo.findById(id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    await ForSeo.findByIdAndRemove(id);
    return res.status(200).json({ success: true, message: "Removed From Seo" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.updateSeo = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, web_title, web_description, productType } = req.body;
    const check = await ForSeo.findById(id);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing Found With Given Id" });
    }
    await ForSeo.findOneAndUpdate(
      { _id: id },
      { product_id, web_title, web_description, productType },
      { new: true }
    );
    return res.status(200).json({ success: true, message: "Updated For Seo" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
