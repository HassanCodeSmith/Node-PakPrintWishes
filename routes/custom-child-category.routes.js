const customChildCategoryRouter = require("express").Router();
const {
  createCustomChildCategory,
  getAllCustomChildCategories,
  getCustomChildCategoryById,
  deleteCustomChildCategoryById,
  updateCustomChildCategoryById,
  changeCustomChildCategoryStatus,
} = require("../controllers/custom-child-category.controllers");
const { upload } = require("../utils/upload");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

// add custom child category
customChildCategoryRouter.post(
  "/createCustomChildCategory",
  upload.single("customChildCategoryImage"),
  userAuth,
  adminAuth,
  createCustomChildCategory
);

// get all custom child categories
customChildCategoryRouter.get(
  "/getAllCustomChildCategories",
  userAuth,
  adminAuth,
  getAllCustomChildCategories
);

// get custom child category by id
customChildCategoryRouter.get(
  "/getCustomChildCategoryById/:id",
  userAuth,
  adminAuth,
  getCustomChildCategoryById
);

// update custom child category by id
customChildCategoryRouter.patch(
  "/updateCustomChildCategoryById/:id",
  userAuth,
  adminAuth,
  upload.single("customChildCategoryImage"),
  updateCustomChildCategoryById
);

// delete custom child category by id
customChildCategoryRouter.patch(
  "/deleteCustomChildCategoryById/:id",
  userAuth,
  adminAuth,
  deleteCustomChildCategoryById
);

// change custom child category status by id
customChildCategoryRouter.patch(
  "/changeCustomChildCategoryStatus/:id",
  userAuth,
  adminAuth,
  changeCustomChildCategoryStatus
);
module.exports = customChildCategoryRouter;
