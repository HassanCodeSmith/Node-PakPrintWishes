const customChildSeoCategoryRouter = require("express").Router();
const {
  createCustomChildSeoCategory,
  getAllCustomChildSeoCategories,
  getCustomChildSeoCategoryById,
  updateCustomChildSeoCategoryById,
  deleteCustomChildSeoCategoryById,
} = require("../controllers/custom-child-seo-category.controllers");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

// Create Custom Child Seo Category
customChildSeoCategoryRouter.post(
  "/createCustomChildSeoCategory",
  userAuth,
  adminAuth,
  upload.none(),
  createCustomChildSeoCategory
);

// Get All Custom Child Seo Categories
customChildSeoCategoryRouter.get(
  "/getAllCustomChildSeoCategories",
  userAuth,
  adminAuth,
  getAllCustomChildSeoCategories
);

// Get Custom Child Seo Category by Id
customChildSeoCategoryRouter.get(
  "/getCustomChildSeoCategoryById/:id",
  getCustomChildSeoCategoryById
);

// Update Custom Child Seo Category by Id
customChildSeoCategoryRouter.patch(
  "/updateCustomChildSeoCategoryById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  updateCustomChildSeoCategoryById
);

// Delete Custom Child Seo Category by Id
customChildSeoCategoryRouter.patch(
  "/deleteCustomChildSeoCategoryById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  deleteCustomChildSeoCategoryById
);

module.exports = customChildSeoCategoryRouter;
