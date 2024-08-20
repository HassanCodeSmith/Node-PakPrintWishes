const express = require("express");
const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const router = express.Router();
const {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  deleteManyBrand,
} = require("../controllers/brand");

router.post(
  "/createBrand",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  createBrand
);
router.get("/getAllBrands", authMiddleware, getAllBrand);
router.get("/getBrandById/:brandId", authMiddleware, adminAuth, getBrandById);
router.post(
  "/updateBrand/:brandId",
  upload.single("image"),
  authMiddleware,
  adminAuth,
  updateBrand
);
router.delete("/deleteBrand/:brandId", authMiddleware, adminAuth, deleteBrand);
router.post(
  "/deleteManyBrand",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteManyBrand
);

module.exports = router;
