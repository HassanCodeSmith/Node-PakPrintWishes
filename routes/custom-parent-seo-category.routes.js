const customParentSeoCategoryRouter = require("express").Router();
const {
  createCustomParentSeoCategory,
  getAllCustomParentSeoCategories,
  getCustomParentSeoCategoryById,
  updateCustomParentSeoCategoryById,
  deleteCustomParentSeoCategoryById,
} = require("../controllers/custom-parent-seo-category.controllers");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

// Create Custom Parent Seo Category
customParentSeoCategoryRouter.post(
  "/createCustomParentSeoCategory",
  userAuth,
  adminAuth,
  upload.none(),
  createCustomParentSeoCategory
);

// Get All Custom Parent Seo Categories
customParentSeoCategoryRouter.get(
  "/getAllCustomParentSeoCategories",
  userAuth,
  adminAuth,
  getAllCustomParentSeoCategories
);

// Get Custom Parent Seo Category by Id
customParentSeoCategoryRouter.get(
  "/getCustomParentSeoCategoryById/:id",
  getCustomParentSeoCategoryById
);

// Update Custom Parent Seo Category by Id
customParentSeoCategoryRouter.patch(
  "/updateCustomParentSeoCategoryById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  updateCustomParentSeoCategoryById
);

// Delete Custom Parent Seo Category by Id
customParentSeoCategoryRouter.patch(
  "/deleteCustomParentSeoCategoryById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  deleteCustomParentSeoCategoryById
);

module.exports = customParentSeoCategoryRouter;
