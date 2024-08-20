const Wallet = require("../models/wallet");
const WalletHistory = require("../models/walletHistory");
const PaymentHistory = require("../models/paymentHistory");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendEmail");
const payAmountTemplate = require("../templates/payAmount");
// const paymentHistory = require("../models/paymentHistory");

// exports.getWalletDetails = async (req, res) => {
//   try {
//     if (req.role === "vendor") {
//       const { userId } = req.user;
//       const wallet = await Wallet.findOne({ vendor: userId });

//       return res.status(200).json({ success: true, data: wallet });
//     } else {
//       return res
//         .status(403)
//         .json({ success: false, message: "Permission denied." });
//     }
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.getAllVendorsWalletDetails = async (req, res) => {
  try {
    if (req.role === "admin") {
      if (req.query.userType === "User") {
        const wallet = await PaymentHistory.find({})
          .populate({
            path: "vendorId",
            select:
              "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire",
          })
          .sort({ updatedAt: -1 });

        const uniqueVendorIds = new Set();

        const filteredWallet = wallet.filter((item) => {
          if (item.vendorId && item.vendorId.role === "user") {
            if (!uniqueVendorIds.has(item.vendorId._id.toString())) {
              uniqueVendorIds.add(item.vendorId._id.toString());
              return true;
            }
          }
          return false;
        });

        return res.status(200).json({ success: true, data: filteredWallet });
      } else if (req.query.userType === "Vendor") {
        const wallet = await PaymentHistory.find({})
          .sort({ updatedAt: -1 })
          .populate({
            path: "vendorId",
            select:
              "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire",
          });

        const uniqueVendorIds = new Set();

        const filteredWallet = wallet.filter((item) => {
          if (item.vendorId && item.vendorId.role === "vendor") {
            if (!uniqueVendorIds.has(item.vendorId._id.toString())) {
              uniqueVendorIds.add(item.vendorId._id.toString());
              return true;
            }
          }
          return false;
        });

        return res.status(200).json({ success: true, data: filteredWallet });
      } else if (req.query.userType === "All") {
        const wallet = await PaymentHistory.find({})
          .sort({ updatedAt: -1 })
          .populate({
            path: "vendorId",
            select:
              "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
          });

        const uniqueVendorIds = new Set();

        const filteredWallet = wallet.filter((item) => {
          if (item.vendorId && item.vendorId.role === "vendor") {
            if (!uniqueVendorIds.has(item.vendorId._id.toString())) {
              uniqueVendorIds.add(item.vendorId._id.toString());
              return true;
            }
          }
          return false;
        });

        return res.status(200).json({ success: true, data: filteredWallet });
      } else {
        const wallet = await PaymentHistory.find({})
          .sort({ updatedAt: -1 })
          .populate({
            path: "vendorId",
            select:
              "-password -forgotPasswordOtp -resetPasswordToken -setNewPwd -verified -softDeleted -forgotPasswordOtpExpire -resetPasswordTokenExpire ",
          });

        const uniqueVendorIds = new Set();

        const filteredWallet = wallet.filter((item) => {
          if (item.vendorId) {
            if (!uniqueVendorIds.has(item.vendorId._id.toString())) {
              uniqueVendorIds.add(item.vendorId._id.toString());
              return true;
            }
          }
          return false;
        });

        return res.status(200).json({ success: true, data: filteredWallet });
      }
    }

    return res
      .status(400)
      .json({ success: false, message: "Permission denied." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
//<<<OLD METHOD>>>
// exports.payAmount = async (req, res, next) => {
//   try {
//     if (req.role !== "admin") {
//       return res
//         .status(403)
//         .json({ success: false, message: "Permission denied." });
//     }
//     const { TID, wallet, payAmount } = req.body;
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please upload receipt" });
//     }
//     if (!TID || !wallet || !payAmount) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please fill all required fields." });
//     }
//     const screenshot = "/" + req.file.path;
//     const walletDetails = await Wallet.findById(wallet);
//     if (!walletDetails) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Wallet not found." });
//     }
//     const vendor = await User.findById(walletDetails.vendor);
//     if (!vendor) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Vendor not found." });
//     }
//     if (payAmount > walletDetails.total) {
//       return res.status(400).json({
//         success: false,
//         message: "Pay amount cannot be greater than total amount",
//       });
//     }

//     const newWalletHistory = await WalletHistory.create({
//       wallet: walletDetails._id,
//       payAmount,
//       screenshot,
//       TID,
//       currentBalance: walletDetails.currentBalance,
//       remainingBalance: walletDetails.remainingBalance,
//       total: walletDetails.total,
//       vendorBankName: vendor.bank_name,
//       vendorBankNo: vendor.bank_account_number,
//     });
//     const newRemianingBalance = walletDetails.total - payAmount;
//     // const newWithdrawBalance = walletDetails.remainingBalance + payAmount;

//     await Wallet.findOneAndUpdate(
//       { _id: walletDetails._id },
//       {
//         currentBalance: 0,
//         remainingBalance: newRemianingBalance,
//         total: newRemianingBalance,
//         // remainingBalance: newWithdrawBalance,
//       }
//     );

//     await Notification.create({
//       reciever: vendor._id,
//       title: "Payment received",
//       body: `${payAmount} has been received.`,
//       type: "amount",
//       id: walletDetails._id,
//     });

//     const amountTemplates = payAmountTemplate(
//       vendor.first_name,
//       payAmount,
//       new Date(newWalletHistory.createdAt).toDateString()
//     );

//     sendEmail({
//       to: vendor.email,
//       subject: "Payment received",
//       html: amountTemplates,
//     });
//     vendor.fcm_token.forEach((token) => {
//       sendNotification({
//         to: token,
//         notification: {
//           title: "PakPrintwishes",
//           body: "Payment Recieved",
//         },
//       });
//     });
//     return res.status(200).json({
//       success: true,
//       message: "Payment successfully made.",
//       data: newWalletHistory,
//     });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };
