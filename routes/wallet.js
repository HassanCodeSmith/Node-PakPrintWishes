const WalletRouter = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

const {
  getWalletDetails,
  getAllVendorsWalletDetails,
  payAmount,
} = require("../controllers/wallet");

// WalletRouter.get("/getWalletDetails", userAuth, adminAuth, getWalletDetails);
WalletRouter.get(
  "/getAllVendorsWalletDetails",
  userAuth,
  adminAuth,
  getAllVendorsWalletDetails
);
// WalletRouter.post(
//   "/payAmount",
//   userAuth,
//   adminAuth,
//   upload.single("image"),
//   payAmount
// );

module.exports = WalletRouter;
