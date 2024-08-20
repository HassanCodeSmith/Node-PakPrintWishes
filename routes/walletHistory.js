const walletHistoryRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

const {
  getWalletHistoryByWallet,
  getVendorWalletHistory,
} = require("../controllers/walletHistory");

walletHistoryRouter.get(
  "/getWalletHistoryByWallet/:vendorId",
  userAuth,
  adminAuth,
  getWalletHistoryByWallet
);
walletHistoryRouter.get(
  "/getVendorWalletHistory",
  userAuth,
  adminAuth,
  getVendorWalletHistory
);

module.exports = walletHistoryRouter;
