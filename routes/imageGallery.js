const imageGalleryRouter = require("express").Router();
const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const {
  addImgInGlry,
  getImag,
  deleteImage,
} = require("../controllers/imageGallery");
imageGalleryRouter.post(
  "/add/image/to/gallery",
  authMiddleware,
  adminAuth,
  upload.any(),
  addImgInGlry
);
imageGalleryRouter.get(
  "/getImag/:folderId",
  authMiddleware,
  adminAuth,
  getImag
);
imageGalleryRouter.delete(
  "/deleteImage/:imgId",
  authMiddleware,
  adminAuth,
  deleteImage
);

module.exports = imageGalleryRouter;
