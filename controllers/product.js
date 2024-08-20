const Product = require("../models/product");
const getRandomProducts = require("../utils/randomElementFromArray");
const ProductIdCounter = require("../models/productCounter");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const addProduct = require("../templates/addProduct");
const sendNotification = require("../utils/sendNotificatoin");
const notification = require("../models/notification");
// const productUpdate = require("../templates/productUpdate");
const productUpdate = require("../templates/productUpdate");
const productUpdateVendor = require("../templates/productUpdateVendor");

exports.addProduct = async (req, res) => {
  try {
    const { userId } = req.user;
    const { product_type } = req.body;
    console.log(product_type);
    let status = false;

    if (req.role?.toLowerCase() === "admin") {
      status = true;
    }

    let counter = await ProductIdCounter.findOneAndUpdate(
      {},
      { $inc: { value: 1 } },
      { new: true }
    );
    if (!counter) {
      counter = await ProductIdCounter.create({ value: 1 });
    }

    const productNewId = `ppw-${counter.value.toString().padStart(3, "0")}-024`;

    if (product_type === "Product") {
      const {
        /** Common fields for products and accessories */
        product_brand_id,
        product_title,
        product_category_id,
        product_child_category_id,
        old_price,
        discount,
        new_price,
        product_description,
        shiping_fee,
        images,
        /** Below fields specify for product */
        product_advance,
        featured_product,
        product_new_arrival,
        buynow,
        delivered_days,
        minQuantity,
      } = req.body;
      // if (req.files.length === 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "You must select at least 1 file.",
      //   });
      // }
      // const productImages = req.files.map((image, index) => {
      //   return "/" + image.path;
      // });
      // console.log(req.body);
      if (product_child_category_id === "") {
        const product = await Product.create({
          product_brand_id,
          product_category_id,
          //  product_child_category_id,
          product_title,
          product_description,
          old_price,
          discount,
          new_price,
          shiping_fee,
          product_advance,
          delivered_days,
          featured_product,
          product_new_arrival,
          buynow,
          images,
          product_type,
          vendor: userId,
          productCode: productNewId,
          status,
          minQuantity,
          product_type: "Product",
        });
        if (req.role === "vendor") {
          const findUser = await User.findById(userId);
          if (!findUser) {
            return res.status(404).json({ error: "User not found" });
          }

          const admins = await User.find({ role: "admin" });

          admins.forEach(async (admin) => {
            const addProductTemplate = addProduct(
              findUser.first_name,
              new_price,
              product_description
            );
            sendEmail({
              to: admin.email,
              subject: "New Product Added.",
              html: addProductTemplate,
            });

            const notification = await Notification.create({
              reciever: admin._id,
              userId: findUser._id,
              id: product._id.toString(),
              title: "New Product ",
              body: `${findUser.first_name} has added a new product ${product_title}. Please review the product.`,
              type: "newProduct",
            });
            console.log(notification);
          });
        }
        return res.status(200).json({
          success: true,
          data: product,
          message: "Product Added Successfully",
        });
      } else {
        const product = await Product.create({
          product_brand_id,
          product_category_id,
          product_child_category_id,
          product_title,
          product_description,
          old_price,
          discount,
          new_price,
          shiping_fee,
          product_advance,
          delivered_days,
          featured_product,
          product_new_arrival,
          buynow,
          images,
          product_type,
          vendor: userId,
          productCode: productNewId,
          status,
          minQuantity,
          product_type: "Product",
        });
        if (req.role === "vendor") {
          const findUser = await User.findById(userId);
          if (!findUser) {
            return res.status(404).json({ error: "User not found" });
          }

          const admins = await User.find({ role: "admin" });

          admins.forEach(async (admin) => {
            const addProductTemplate = addProduct(
              findUser.first_name,
              new_price,
              product_description
            );
            sendEmail({
              to: admin.email,
              subject: "New Product Added.",
              html: addProductTemplate,
            });

            const notification = await Notification.create({
              reciever: admin._id,
              userId: findUser._id,
              id: product._id.toString(),
              title: "New Product ",
              body: `${findUser.first_name} has added a new product ${product_title}. Please review the product.`,
              type: "newProduct",
            });
            console.log(notification);
          });
        }
        return res.status(200).json({
          success: true,
          data: product,
          message: "Product Added Successfully",
        });
      }

      // console.log(req.role);
      // if (req.role === "vendor") {
      //   const findUser = await User.findById(userId);
      //   if (!findUser) {
      //     return res.status(404).json({ error: "User not found" });
      //   }

      //   const admins = await User.find({ role: "admin" });

      //   admins.forEach(async (admin) => {
      //     const addProductTemplate = addProduct(
      //       findUser.first_name,
      //       new_price,
      //       product_description
      //     );
      //     sendEmail({
      //       to: admin.email,
      //       subject: "New Product Added.",
      //       html: addProductTemplate,
      //     });

      //     const notification = await Notification.create({
      //       reciever: admin._id,
      //       userId: findUser._id,
      //       id: product._id.toString(),
      //       title: "New Product ",
      //       body: `${findUser.first_name} has added a new product ${product_title}. Please review the product.`,
      //       type: "newProduct",
      //     });
      //     console.log(notification);
      //   });
      // }
      // return res.status(200).json({
      //   success: true,
      //   data: product,
      //   message: "Product Added Successfully",
      // });
    } else if (product_type === "Accessories") {
      const {
        /** Common fields for products and accessories */
        product_brand_id,
        product_title,
        product_category_id,
        product_child_category_id,
        old_price,
        discount,
        new_price,
        product_description,
        shiping_fee,
        images,

        /** Bellow fields specifies for accessories */
        accessories_condition,
        accessories_type,
        accessories_Location,
      } = req.body;
      // if (req.files.length === 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "You must select at least 1 file.",
      //   });
      // }
      // const AccessoriesImages = req.files.map((image, index) => {
      //   return "/" + image.path;
      // });
      // console.log(req.body);
      if (product_child_category_id === "") {
        const accessories = await Product.create({
          /** Common fields for products and accessories */
          product_brand_id,
          product_title,
          product_category_id,
          // product_child_category_id,
          old_price,
          discount,
          new_price,
          product_description,
          shiping_fee,
          vendor: userId,
          productCode: productNewId,
          images,
          product_type,

          /** Bellow fields specifies for accessories */
          accessories_condition,
          accessories_type,
          accessories_Location,
        });

        if (req.role === "vendor") {
          const findUser = await User.findById(userId);
          if (!findUser) {
            return res.status(404).json({ error: "User not found" });
          }

          const admins = await User.find({ role: "admin" });

          admins.forEach(async (admin) => {
            const addProductTemplate = addProduct(
              findUser.first_name,
              new_price,
              product_description
            );
            sendEmail({
              to: admin.email,
              subject: "New Product Added.",
              html: addProductTemplate,
            });

            const notification = await Notification.create({
              reciever: admin._id,
              userId: findUser._id,
              id: accessories._id.toString(),
              title: "New Product ",
              body: `${findUser.first_name} has added a new product ${product_title}. Please review the product.`,
              type: "newProduct",
            });
            console.log(notification);
          });
        }

        return res.status(200).json({
          success: true,
          data: accessories,
          message: "Accessories Added Successfully",
        });
      }
      const accessories = await Product.create({
        /** Common fields for products and accessories */
        product_brand_id,
        product_title,
        product_category_id,
        product_child_category_id,
        old_price,
        discount,
        new_price,
        product_description,
        shiping_fee,
        vendor: userId,
        productCode: productNewId,
        images,
        product_type,

        /** Bellow fields specifies for accessories */
        accessories_condition,
        accessories_type,
        accessories_Location,
      });

      if (req.role === "vendor") {
        const findUser = await User.findById(userId);
        if (!findUser) {
          return res.status(404).json({ error: "User not found" });
        }

        const admins = await User.find({ role: "admin" });

        admins.forEach(async (admin) => {
          const addProductTemplate = addProduct(
            findUser.first_name,
            new_price,
            product_description
          );
          sendEmail({
            to: admin.email,
            subject: "New Product Added.",
            html: addProductTemplate,
          });

          const notification = await Notification.create({
            reciever: admin._id,
            userId: findUser._id,
            id: accessories._id.toString(),
            title: "New Product ",
            body: `${findUser.first_name} has added a new product ${product_title}. Please review the product.`,
            type: "newProduct",
          });
          console.log(notification);
        });
      }

      return res.status(200).json({
        success: true,
        data: accessories,
        message: "Accessories Added Successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Product type must be provided" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(","),
      });
    }
    if (error.code && error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Product Code already taken." });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllProductsPublic = async (req, res) => {
  try {
    let query = {
      product_type: "Product",
      product_status: true,
      permanentDeleted: false,
      status: { $ne: false },
    };
    // console.log(req.role);
    const allProducts = await Product.find(query)
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    // console.log(allProducts);
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// exports.getSameProducts = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }
//     console.log(product.product_child_category_id);
//     // const regex = new RegExp("^" + product.product_title, "i");
//     // console.log(regex);

//     const allProducts = await Product.find({
//       // product_title: { $regex: regex },
//       product_child_category_id: product.product_child_category_id,
//       // $or: [
//       //   { product_brand_id: product.product_brand_id },
//       //   { product_category_id: product.product_category_id },
//       //   { product_child_category_id: product.product_child_category_id },
//       // ],
//       permanentDeleted: false,
//       product_status: true,
//       // product_type: product.product_type,
//       status: { $ne: false },
//     })
//       .populate("product_brand_id")
//       .populate("product_category_id")
//       .populate("product_child_category_id");

//     // let count = 0;
//     // allProducts.length < 4 ? (count = allProducts.length) : (count = 4);
//     // // console.log(count);
//     // const randomProducts = getRandomProducts(allProducts, count);
//     // console.log(allProducts);
//     return res
//       .status(200)
//       .json({ success: true, data: allProducts.slice(0, 4) });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.getSameProducts = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const allProducts = await Product.find({
      _id: { $ne: productId }, // Exclude the current product
      product_child_category_id: product.product_child_category_id,
      permanentDeleted: false,
      product_status: true,
      status: { $ne: false },
    })
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");

    return res
      .status(200)
      .json({ success: true, data: allProducts.slice(0, 4) });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const allProducts = await Product.findById(req.params.productId)
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    // console.log(allProducts);
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllProductsByParentCategory = async (req, res) => {
  try {
    const { parnetId } = req.params;
    let query = {
      product_type: "Product",
      product_status: true,
      product_category_id: parnetId,
      permanentDeleted: false,
      status: { $ne: false },
    };
    // console.log(query);
    const allProducts = await Product.find(query)
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    // console.log(allProducts);
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllProductsBySubCategory = async (req, res) => {
  try {
    const { subId } = req.params;
    let query = {
      product_type: "Product",
      product_status: true,
      product_child_category_id: subId,
      permanentDeleted: false,
      status: { $ne: false },
    };
    // console.log(query);
    const allProducts = await Product.find(query)
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    // console.log(allProducts);
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    let query = {
      product_type: "Product",
      product_status: true,
      permanentDeleted: false,
    };

    req.role !== "admin" ? (query.vendor = req.user.userId) : null;

    console.log(query);
    const allProducts = await Product.find(query)
      .sort({ updatedAt: -1 })
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    console.log(allProducts);
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllDeletedProducts = async (req, res) => {
  try {
    let query = {
      // product_type: "Product",
      product_status: false,
      permanentDeleted: false,
    };
    // console.log(req.role);
    req.role !== "admin" ? (query.vendor = req.user.userId) : null;

    const allProducts = await Product.find(query)
      .sort({ updatedAt: -1 })
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    // console.log(allProducts);
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAccessoriesPublic = async (req, res) => {
  try {
    let query = {
      product_type: "Accessories",
      product_status: true,
      permanentDeleted: false,
      status: { $ne: false },
    };

    const allAccessories = await Product.find(query)
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    return res.status(200).json({ success: true, data: allAccessories });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAccessories = async (req, res) => {
  try {
    let query = {
      product_type: "Accessories",
      product_status: true,
      permanentDeleted: false,
    };

    req.role !== "admin" ? (query.vendor = req.user.userId) : null;

    const allAccessories = await Product.find(query)
      .sort({ updatedAt: -1 })
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    return res.status(200).json({ success: true, data: allAccessories });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllDeletedAccessories = async (req, res) => {
  try {
    let query = {
      product_type: "Accessories",
      product_status: false,
      permanentDeleted: false,
    };

    req.role !== "admin" ? (query.vendor = req.user.userId) : null;

    const allAccessories = await Product.find(query)
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");
    return res.status(200).json({ success: true, data: allAccessories });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { productId } = req.params;
    const check = await Product.findById(productId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    switch (req.role) {
      case "admin":
        await Product.findOneAndUpdate(
          { _id: productId },
          { product_status: false },
          { new: true }
        );
        break;
      case "vendor":
        if (req.user.userId.toString() === check.vendor.toString()) {
          await Product.findOneAndUpdate(
            { _id: productId },
            { product_status: false },
            { new: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to remove this product.",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to remove this product.",
        });
    }
    return res.status(200).json({
      success: true,
      message: "Product successfully sent to All Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.restoreProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const check = await Product.findById(productId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    switch (req.role) {
      case "admin":
        await Product.findOneAndUpdate(
          { _id: productId },
          { product_status: true },
          { new: true }
        );
        break;
      case "vendor":
        if (req.user.userId.toString() === check.vendor.toString()) {
          await Product.findOneAndUpdate(
            { _id: productId },
            { product_status: true },
            { new: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to restore this product.",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to restore this product.",
        });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product successfully Restore" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.permanentDelete = async (req, res) => {
  try {
    const { productId } = req.params;
    const check = await Product.findById(productId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    switch (req.role) {
      case "admin":
        await Product.updateOne({ _id: productId }, { permanentDeleted: true });
        break;
      case "vendor":
        if (req.user.userId.toString() === check.vendor.toString()) {
          await Product.updateOne(
            { _id: productId },
            { permanentDeleted: true }
          );
        } else {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to remove this product.",
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: "You do not have permission to remove this product.",
        });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product successfully deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllNewArrival = async (req, res) => {
  try {
    const newArrival = await Product.find({
      product_new_arrival: true,
      product_status: true,
      permanentDeleted: false,
      status: { $ne: false },
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: newArrival });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllFeature = async (req, res) => {
  try {
    const allFeatures = await Product.find({
      featured_product: true,
      product_status: true,
      permanentDeleted: false,
      status: { $ne: false },
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: allFeatures });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllBuyNow = async (req, res) => {
  try {
    const allBuyNow = await Product.find({
      buynow: true,
      product_status: true,
      permanentDeleted: false,
      status: { $ne: false },
    });
    return res.status(200).json({ success: true, data: allBuyNow });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.multipleSoftDeleteProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;

    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { product_status: false } }
    );
    const { url } = req;

    let data;
    if (url === "/product/multipleSoftDeleteProduct") {
      data = await Product.find({
        product_type: "Product",
        product_status: true,
        permanentDeleted: false,
      })
        .populate("product_brand_id")
        .populate("product_category_id")
        .populate("product_child_category_id");
    } else {
      data = await Product.find({
        product_type: "Accessories",
        product_status: true,
        permanentDeleted: false,
      })
        .populate("product_brand_id")
        .populate("product_category_id")
        .populate("product_child_category_id");
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.multiplePermanentDelete = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;

    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { permanentDeleted: true } }
    );

    const data = await Product.find({ product_status: false })
      .populate("product_brand_id")
      .populate("product_category_id")
      .populate("product_child_category_id");

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// exports.updateProduct = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const { productId } = req.params;
//     const user = await User.findById(userId);
//     const check = await Product.findById(productId).populate("vendor");
//     console.log(check.vendor.email);
//     if (!req.body.images) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Select an Image" });
//     }
//     if (req.body.images === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Select an Image" });
//     }
//     if (!check) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }
//     switch (req.role) {
//       case "admin":
//         const productUpdating = await Product.findOneAndUpdate(
//           { _id: productId },
//           { ...req.body },
//           { runValidators: true }
//         );

//         const admins = await User.find({ role: "admin" });

//         // admins.forEach(async (admin) => {
//         const productUpdates = productUpdate(
//           check.vendor.first_name,
//           check.product_title
//         );
//         console.log(productUpdates);
//         sendEmail({
//           to: check.vendor.email,
//           subject: `Admin has updated the product "${check.product_title}".`,
//           html: productUpdates,
//         });
//         const notification = await Notification.create({
//           reciever: check.vendor._id,
//           userId: userId,
//           id: productId.toString(),
//           title: "Product Updated.",
//           body: `Admin has updated product ${check.product_title}.`,
//           type: "updateProduct",
//         });
//         console.log(notification);
//         break;

//       case "vendor":
//         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//         if (req.user.userId.toString() === check.vendor.toString()) {
//           await Product.findOneAndUpdate(
//             { _id: productId },
//             { ...req.body },
//             { runValidators: true }
//           );
//         } else {
//           return res.status(403).json({
//             success: false,
//             message: "You do not have permission to update this product.",
//           });
//         }

//         const adminz = await User.find({ role: "admin" });

//         adminz.forEach(async (admin) => {
//           const productUpdates = productUpdateVendor(
//             admin.first_name,
//             check.vendor.first_name,
//             check.product_title
//           );
//           console.log(productUpdates);
//           sendEmail({
//             to: admin.email,
//             subject: `Vendor has updated the product "${check.product_title}".`,
//             html: productUpdates,
//           });
//           const notification = await Notification.create({
//             reciever: admin._id,
//             userId: userId,
//             id: productId.toString(),
//             title: "Product Update Request.",
//             body: `Vendor has updated the product "${check.product_title}".`,
//             type: "updateProduct",
//           });
//           console.log(notification);
//         });
//         break;
//       default:
//         return res.status(403).json({
//           success: false,
//           message: "You do not have permission to update this product.",
//         });
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "Product updated successfully" });
//   } catch (error) {
//     console.log(error);
//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: Object.values(error.errors)
//           .map((item) => item.message)
//           .join(","),
//       });
//     }
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.updateProduct = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    const {
      product_brand_id,
      product_category_id,
      product_child_category_id,
      product_title,
      product_description,
      old_price,
      discount,
      new_price,
      shiping_fee,
      product_advance,
      delivered_days,
      featured_product,
      product_new_arrival,
      buynow,
      minQuantity,
      // productCode,
      images,
    } = req.body;
    const user = await User.findById(userId);
    const check = await Product.findById(productId).populate("vendor");
    console.log(">>>>>>>", req.body);
    if (!req.body.images) {
      return res
        .status(400)
        .json({ success: false, message: "Select an Image" });
    }
    if (req.body.images === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Select an Image" });
    }
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (user.role === "admin") {
      if (product_child_category_id === "") {
        const productUpdating = await Product.findOneAndUpdate(
          { _id: productId },
          {
            product_brand_id,
            product_category_id,
            //  product_child_category_id,
            product_title,
            product_description,
            minQuantity,
            old_price,
            discount,
            new_price,
            shiping_fee,
            product_advance,
            delivered_days,
            featured_product,
            product_new_arrival,
            buynow,
            images,
          },
          { runValidators: true }
        );
      } else {
        const productUpdating = await Product.findOneAndUpdate(
          { _id: productId },
          {
            product_brand_id,
            product_category_id,
            product_child_category_id,
            product_title,
            product_description,
            minQuantity,
            old_price,
            discount,
            new_price,
            shiping_fee,
            product_advance,
            delivered_days,
            featured_product,
            product_new_arrival,
            buynow,
            images,
          },
          { runValidators: true }
        );
      }

      // const admins = await User.find({ role: "admin" });

      // admins.forEach(async (admin) => {
      const productUpdates = productUpdate(
        check.vendor.first_name,
        check.product_title
      );
      console.log(productUpdates);
      sendEmail({
        to: check.vendor.email,
        subject: `Admin has updated the product "${check.product_title}".`,
        html: productUpdates,
      });
      const notification = await Notification.create({
        reciever: check.vendor._id,
        userId: user._id,
        id: productId.toString(),
        title: "Product Updated.",
        body: `Admin has updated product ${check.product_title}.`,
        type: "updateProduct",
      });
      console.log(notification);
      return res
        .status(200)
        .json({ success: false, message: "Product updated successfully" });
    } else if (user.role === "vendor") {
      // console.log("REQUSERRR", req.user.userId.toString());
      // console.log("CHECKKKKKKUSER", check.vendor._id.toString());
      if (req.user.userId.toString() === check.vendor._id.toString()) {
        await Product.findOneAndUpdate(
          { _id: productId },
          {
            product_brand_id,
            product_category_id,
            product_child_category_id: product_child_category_id
              ? product_child_category_id
              : null,
            product_title,
            product_description,
            minQuantity,
            old_price,
            discount,
            new_price,
            shiping_fee,
            product_advance,
            delivered_days,
            featured_product,
            product_new_arrival,
            buynow,
            images,
          },
          { runValidators: true }
        );
        const adminz = await User.find({ role: "admin" });

        adminz.forEach(async (admin) => {
          const productUpdates = productUpdateVendor(
            admin.first_name,
            check.vendor.first_name,
            check.product_title
          );
          console.log(productUpdates);
          sendEmail({
            to: admin.email,
            subject: `Vendor has updated the product "${check.product_title}".`,
            html: productUpdates,
          });
          const notification = await Notification.create({
            reciever: admin._id,
            userId: userId,
            id: productId.toString(),
            title: "Product Update Request.",
            body: `Vendor has updated the product "${check.product_title}".`,
            type: "updateProduct",
          });
          console.log(notification);
        });
        return res
          .status(200)
          .json({ success: true, message: "Product updated successfully" });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this product.",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(","),
      });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyProduct = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Access Denied." });
    }
    const { productId } = req.body;
    const check = await Product.findById(productId);

    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      status: !check.status,
    });
    res
      .status(200)
      .json({ success: true, message: "Product verified successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { search } = req.body;
    // console.log(search);
    if (search) {
      let data = await Product.find({
        $or: [{ product_title: new RegExp(search, "i") }],
        permanentDeleted: false,
        product_status: true,
      });
      if (data.length === 0) {
        return res.status(200).json({ success: false, data: [] });
      }
      return res
        .status(200)
        .json({ success: true, count: data.length, data: data });
    }
    return res.status(200).json({ success: false, data: [] });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
};

exports.getAllProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendorProducts = await Product.find({ vendor: vendorId });
    if (!vendorProducts) {
      return res
        .status(400)
        .json({ success: false, message: "No Product For This Vendor" });
    }
    return res.status(200).json({ success: true, data: vendorProducts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
