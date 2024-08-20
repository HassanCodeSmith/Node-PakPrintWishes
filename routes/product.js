const express = require("express");
const ProductRouter = express.Router();

const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  addProduct,
  getAllProducts,
  getAllAccessories,
  softDelete,
  restoreProduct,
  permanentDelete,
  getAllNewArrival,
  getAllFeature,
  getAllBuyNow,
  multipleSoftDeleteProduct,
  getAllDeletedProducts,
  multiplePermanentDelete,
  updateProduct,
  getAllAccessoriesPublic,
  getAllProductsPublic,
  getAllProductsByParentCategory,
  getAllProductsBySubCategory,
  getProduct,
  getSameProducts,
  verifyProduct,
  search,
  getAllProductsByVendor,
} = require("../controllers/product");

ProductRouter.post(
  "/addProduct",
  authMiddleware,
  adminAuth,
  upload.any(),
  addProduct
);

ProductRouter.post("/search/product", upload.any(), search);
ProductRouter.post(
  "/updateProduct/:productId",
  authMiddleware,
  // adminAuth,
  upload.any(),
  updateProduct
);
ProductRouter.get("/user/getAllProducts", getAllProductsPublic);
ProductRouter.get("/user/getProduct/:productId", getProduct);
ProductRouter.get("/user/getSameProducts/:productId", getSameProducts);
ProductRouter.get(
  "/user/getAllProductsByParentCategory/:parnetId",
  getAllProductsByParentCategory
);
ProductRouter.get(
  "/user/getAllProductsBySubCategory/:subId",
  getAllProductsBySubCategory
);
ProductRouter.get(
  "/vendor/getAllProducts",
  authMiddleware,
  adminAuth,
  getAllProducts
);
ProductRouter.get(
  "/getProductByVendorId/:vendorId",
  authMiddleware,
  adminAuth,
  getAllProductsByVendor
);

ProductRouter.get("/user/getAllAccessories", getAllAccessoriesPublic);
ProductRouter.get(
  "/vendor/getAllAccessories",
  authMiddleware,
  adminAuth,
  getAllAccessories
);
ProductRouter.get(
  "/getAllDeletedProducts",
  authMiddleware,
  adminAuth,
  getAllDeletedProducts
);
// ProductRouter.get(
//   "/getAllDeletedAccessories",
//   authMiddleware,
//   adminAuth,
//   getAllAccessories
// );
ProductRouter.get("/getAllNewArrival", getAllNewArrival);
ProductRouter.get("/getAllFeature", getAllFeature);
ProductRouter.get("/getAllBuyNow", getAllBuyNow);

ProductRouter.patch(
  "/softDeleteProduct/:productId",
  authMiddleware,
  adminAuth,
  softDelete
);
ProductRouter.patch(
  "/restoreProduct/:productId",
  authMiddleware,
  adminAuth,
  restoreProduct
);
ProductRouter.delete(
  "/permanentDeleteProducts/:productId",
  authMiddleware,
  adminAuth,
  permanentDelete
);

ProductRouter.post(
  "/multiplePermanentDeleteProducts",
  authMiddleware,
  adminAuth,
  upload.none(),
  multiplePermanentDelete
);

ProductRouter.post(
  "/product/multipleSoftDeleteProduct",
  authMiddleware,
  adminAuth,
  upload.none(),
  multipleSoftDeleteProduct
);

ProductRouter.post(
  "/accessories/multipleSoftDeleteProduct",
  authMiddleware,
  adminAuth,
  upload.none(),
  multipleSoftDeleteProduct
);

ProductRouter.post(
  "/admin/verifyProduct",
  authMiddleware,
  adminAuth,
  upload.none(),
  verifyProduct
);

module.exports = ProductRouter;
