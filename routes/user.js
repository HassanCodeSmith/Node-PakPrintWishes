const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const {
  getAllUsers,
  deleteUser,
  blockUnblockUser,
  getProfile,
  getAllVendors,
  deleteMultipleUsers,
  getAllVendorsName,
  deleteAccount,
  vendorStatus,
  getVendorById,
  deleteMultipleVendor,
} = require("../controllers/user");
const { upload } = require("../utils/upload");

router.get("/getProfile", authMiddleware, getProfile);
router.get("/getAllVendors", authMiddleware, adminAuth, getAllVendors);
router.get(
  "/getVendorById/:vendorId",
  authMiddleware,
  adminAuth,
  getVendorById
);
router.get("/getAllVendorsName", authMiddleware, adminAuth, getAllVendorsName);
router.get("/getAllUsers", authMiddleware, adminAuth, getAllUsers);
router.delete(
  "/user/deleteUser/:userId",
  authMiddleware,
  adminAuth,
  deleteUser
);
router.delete("/user/deleteAccount", authMiddleware, deleteAccount);
router.delete(
  "/vendor/deleteUser/:userId",
  authMiddleware,
  adminAuth,
  deleteUser
);
router.post(
  "/user/deleteMultipleUsers",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultipleUsers
);
router.post(
  "/vendor/deleteMultipleUsers",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultipleVendor
);
router.patch(
  "/blockUnblockUser/:userId",
  authMiddleware,
  adminAuth,
  upload.none(),
  blockUnblockUser
);
router.patch(
  "/vendorStatus/:userId",
  authMiddleware,
  adminAuth,
  upload.none(),
  vendorStatus
);

module.exports = router;
