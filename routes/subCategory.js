const express = require("express");
const { upload } = require("../utils/upload");
const SubRouter = express.Router();
const {
  createsubCategory,
  getallSubCategory,
  deleteSubCategory,
  updateSubCategory,
  deleteMultipleSubCategory,
  getallSubCategoryPublic,
  verifyCategory,
  getSubCategoriesWithCategoryType,
} = require("../controllers/subCategory");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

SubRouter.get(
  "/getallSubCategory",
  authMiddleware,
  adminAuth,
  getallSubCategory
);
SubRouter.get(
  "/user/getallSubCategoryByParentId/:parentId",
  getallSubCategoryPublic
);
SubRouter.post(
  "/createsubCategory",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  createsubCategory
);
SubRouter.delete(
  "/deleteSubCategory/:subId",
  authMiddleware,
  adminAuth,
  deleteSubCategory
);

SubRouter.post(
  "/deleteMultipleSubCategory",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultipleSubCategory
);

SubRouter.post(
  "/updateSubCategory/:subId",
  authMiddleware,
  adminAuth,
  upload.none(),
  updateSubCategory
);

SubRouter.post(
  "/admin/verifySubCategory",
  authMiddleware,
  adminAuth,
  upload.none(),
  verifyCategory
);

SubRouter.get(
  "/getSubCategoriesWithCategoryType/:categoryType",
  authMiddleware,
  adminAuth,
  getSubCategoriesWithCategoryType
);

module.exports = SubRouter;
