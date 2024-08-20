const customParentCategoryRouter = require("express").Router();
const {
  createCustomParentCategory,
  getAllCustomParentCategories,
  getCustomParentCategoryById,
  deleteCustomParentCategoryById,
  updateCustomParentCategoryById,
  changeCustomParentCategoryStatus,
} = require("../controllers/custom-parent-category.controllers");
const { upload } = require("../utils/upload");
const adminAuth = require("../middlewares/Adminauth");
const userAuth = require("../middlewares/userAuth");

// add custom parent category
customParentCategoryRouter.post(
  "/createCustomParentCategory",
  userAuth,
  adminAuth,
  upload.single("customParentCategoryImage"),
  createCustomParentCategory
);

// get all custom parent categories
customParentCategoryRouter.get(
  "/getAllCustomParentCategories",
  userAuth,
  adminAuth,
  getAllCustomParentCategories
);

// get custom parent category by id
customParentCategoryRouter.get(
  "/getCustomParentCategoryById/:id",
  userAuth,
  adminAuth,
  getCustomParentCategoryById
);

// delete custom parent category by id
customParentCategoryRouter.patch(
  "/deleteCustomParentCategoryById/:id",
  userAuth,
  adminAuth,
  deleteCustomParentCategoryById
);

// update custom parent category by id
customParentCategoryRouter.patch(
  "/updateCustomParentCategoryById/:id",
  upload.single("customParentCategoryImage"),
  userAuth,
  adminAuth,
  updateCustomParentCategoryById
);

// change status for custom parent category by id
customParentCategoryRouter.patch(
  "/changeCustomParentCategoryStatus/:id",
  userAuth,
  adminAuth,
  changeCustomParentCategoryStatus
);
module.exports = customParentCategoryRouter;
