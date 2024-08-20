const WalletHistory = require("../models/walletHistory");
const PaymentHistory = require("../models/paymentHistory");
const Wallet = require("../models/wallet");

exports.getWalletHistoryByWallet = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Permission denied", success: false });
    }
    const paymentHistory = await PaymentHistory.find({
      vendorId,
    })
      .populate({
        path: "orderId",
        populate: {
          path: "order",
        },
      })

      .sort({ updatedAt: -1 });
    // console.log(walletHistory);
    res.status(200).json({ data: paymentHistory, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getVendorWalletHistory = async (req, res) => {
  try {
    if (req.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Permission denied", success: false });
    }
    const { userId } = req.user;
    console.log({ userId });
    const findWallet = await Wallet.findOne({ vendor: userId });
    if (!findWallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found", success: false });
    }
    const walletHistory = await WalletHistory.find({
      wallet: findWallet._id,
    }).sort({ createdAt: -1 });
    // console.log(walletHistory);
    res.status(200).json({ data: walletHistory, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
