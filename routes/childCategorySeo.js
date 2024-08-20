const express = require("express");
const ParentCatSeoRouter = express.Router();
const { uploadFile, upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  addForSeo,
  getAll,
  getById,
  updateSeo,
  deleteSeo,
} = require("../controllers/childCateSeo");

ParentCatSeoRouter.post(
  "/seo/addSubCategorytoSeo",
  authMiddleware,
  adminAuth,
  upload.none(),
  addForSeo
);
ParentCatSeoRouter.get("/seo/getAllSubCate", authMiddleware, adminAuth, getAll);
ParentCatSeoRouter.get("/seo/getSubCate/:id", getById);
ParentCatSeoRouter.delete(
  "/seo/deleteSubCate/:id",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteSeo
);
ParentCatSeoRouter.patch(
  "/seo/updateSubCate/:id",
  authMiddleware,
  adminAuth,
  upload.none(),
  updateSeo
);

module.exports = ParentCatSeoRouter;
