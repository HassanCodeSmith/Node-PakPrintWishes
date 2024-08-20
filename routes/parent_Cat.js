const express = require("express");

const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const ParentRouter = express.Router();
const {
  createParentCategory,
  getParentCategory,
  updateParentCategory,
  deleteManyParentCategory,
  deleteParentCategory,
  getParentCategoryPublic,
  getCategoryDetailsById,
  getParentCategoryFolders,
  verifyCategory,
  getParentCategoriesWithCategoryType,
} = require("../controllers/parent_category.js");
ParentRouter.post(
  "/createParentCategory",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  createParentCategory
);
ParentRouter.get(
  "/getParentCategory",
  authMiddleware,
  adminAuth,
  getParentCategory
);
ParentRouter.get("/user/getParentCategory", getParentCategoryPublic);
ParentRouter.get("/user/getCategoryDetailsById/:id", getCategoryDetailsById);
ParentRouter.post(
  "/UpdateParentCategory/:ParentCategoryId",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  updateParentCategory
);
ParentRouter.post(
  "/deleteManyParentCategory",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteManyParentCategory
);
ParentRouter.post(
  "/admin/verifyCategory",
  authMiddleware,
  adminAuth,
  upload.none(),
  verifyCategory
);
ParentRouter.delete(
  "/deleteParentCategory/:ParentCategoryId",
  authMiddleware,
  adminAuth,
  deleteParentCategory
);

ParentRouter.get(
  "/folder/getParentCategory",
  authMiddleware,
  getParentCategoryFolders
);

ParentRouter.get(
  "/getParentCategoriesWithCategoryType/:categoryType",
  authMiddleware,
  adminAuth,
  getParentCategoriesWithCategoryType
);

module.exports = ParentRouter;
