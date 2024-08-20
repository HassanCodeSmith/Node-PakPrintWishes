const express = require("express");
const SeoRouter = express.Router();
const { uploadFile, upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  addForSeo,
  getAll,
  getById,
  updateSeo,
  deleteSeo,
} = require("../controllers/forSeo");

SeoRouter.post(
  "/seo/addProducttoSeo",
  authMiddleware,
  adminAuth,
  upload.none(),
  addForSeo
);
SeoRouter.get("/seo/getAll", authMiddleware, adminAuth, getAll);
SeoRouter.get("/seo/get/:id", getById);
SeoRouter.delete(
  "/seo/delete/:id",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteSeo
);
SeoRouter.patch(
  "/seo/update/:id",
  authMiddleware,
  adminAuth,
  upload.none(),
  updateSeo
);

module.exports = SeoRouter;
