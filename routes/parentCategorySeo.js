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
} = require("../controllers/categorySeo");

ParentCatSeoRouter.post(
  "/seo/addParCategorytoSeo",
  authMiddleware,
  adminAuth,
  upload.none(),
  addForSeo
);
ParentCatSeoRouter.get("/seo/getAllParCate", authMiddleware, adminAuth, getAll);
ParentCatSeoRouter.get("/seo/getParCate/:id", getById);
ParentCatSeoRouter.delete(
  "/seo/deleteParCate/:id",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteSeo
);
ParentCatSeoRouter.patch(
  "/seo/updateParCate/:id",
  authMiddleware,
  adminAuth,
  upload.none(),
  updateSeo
);

module.exports = ParentCatSeoRouter;
