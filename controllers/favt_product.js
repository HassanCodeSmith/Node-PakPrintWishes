const FavtProduct = require("../models/favt_product");
const Product = require("../models/product");

exports.addToProduct = async (req, res) => {
  try {
    const { productId, status } = req.body;
    console.log(req.body);
    const { userId } = req.user;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const favtProduct = await FavtProduct.findOne({ productId, userId });
    if (!favtProduct) {
      const newFavtProduct = new FavtProduct({
        productId,
        userId,
        status,
      });
      await newFavtProduct.save();
      return res.status(201).json({
        message:
          status === "true"
            ? "Product added to favourites"
            : "Product removed from favourites",
        success: true,
      });
    }

    await FavtProduct.findOneAndUpdate({ _id: favtProduct._id }, { status });

    return res.status(200).json({
      message:
        status === "true"
          ? "Product added to favourites"
          : "Product removed from favourites",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getFavoriteProduct = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    const favtProduct = await FavtProduct.findOne({ userId, productId });
    if (!favtProduct) {
      return res.status(200).json({
        success: true,
        status: false,
      });
    }
    // console.log(favtProduct);
    return res.status(200).json({ success: true, status: favtProduct.status });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getAllFavtProducts = async (req, res) => {
  try {
    const { userId } = req.user;
    const favtProducts = await FavtProduct.find({
      userId,
      status: true,
    }).distinct("productId");

    const products = await Product.find({ _id: { $in: favtProducts } })
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
