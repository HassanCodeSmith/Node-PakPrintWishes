const User = require("../models/user");
const Wallet = require("../models/wallet");
const Product = require("../models/product");

exports.getAllUsers = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const user = await User.find({
      role: "user",
      permanentDeleted: false,
      softDeleted: false,
    })
      .sort({ updatedAt: -1 })
      .select("-password -forgotPasswordOtp -resetPasswordToken");
    return res.status(200).json({ data: user, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.getAllVendors = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const user = await User.find({
      isVendorVerified: { $in: ["pending", "approved", "rejected"] },
      permanentDeleted: false,
      softDeleted: false,
      role: "vendor",
    })
      .select("-password -forgotPasswordOtp -resetPasswordToken")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ data: user, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.getAllVendorsName = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const user = await User.find({
      role: "vendor",
      permanentDeleted: false,
    })
      .select("first_name last_name")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ data: user, success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { userId } = req.params;
    const check = await User.findById(userId);
    if (!check) {
      return res
        .status(400)
        .json({ message: "User not found...", success: false });
    }
    await User.findOneAndUpdate(
      { _id: userId },
      {
        permanentDeleted: true,
        role: "user",
        isVendorVerified: "",
        OTPStatus: "pending",
        verified: false,
      }
    );

    return res
      .status(200)
      .json({ message: "User Deleted...", success: true, id: userId });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const check = await User.findById(userId);
    if (!check) {
      return res
        .status(400)
        .json({ message: "User not found...", success: false });
    }

    await User.findOneAndUpdate({ _id: userId }, { permanentDeleted: true });
    if (check.role == "vendor") {
      await Product.updateMany(
        { createdBy: userId },
        { permanentDeleted: true },
        { new: true }
      );
    }

    return res
      .status(200)
      .json({ message: "Account Deleted...", success: true, id: userId });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteMultipleVendor = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    await User.updateMany(
      { _id: { $in: ids } },
      { $set: { softDeleted: true } }
    );
    // const { url } = req;
    // console.log(req.url);
    // const role = url === "/vendor/deleteMultipleUsers" ? "vendor" : "user";
    const remainingUser = await User.find({
      role: "vendor",
      softDeleted: false,
      permanentDeleted: false,
    }).select("-password -forgotPasswordOtp -resetPasswordToken");
    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
      data: remainingUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteMultipleUsers = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    const { ids } = req.body;
    console.log("idssss", req.body);
    const result = await User.updateMany(
      { _id: { $in: ids } },
      { $set: { softDeleted: true } }
    );
    console.log("works", result);

    if (result.nModified === 0) {
      return res.status(400).json({
        message: "No users were updated. Please check the provided user IDs.",
        success: false,
      });
    }

    const remainingUser = await User.find({
      role: "user",
      softDeleted: false,
      permanentDeleted: false,
    }).select("-password -forgotPasswordOtp -resetPasswordToken");
    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
      data: remainingUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.blockUnblockUser = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied." });
    }
    // const { isVendorVerified } = req.body;
    const { userId } = req.params;
    console.log(req.body);
    const check = await User.findById(userId);
    if (!check) {
      return res.status(400).json({ message: "User not found..." });
    }
    // if (isVendorVerified === "approved") {
    //   const updatedUser = await User.findOneAndUpdate(
    //     { _id: userId },
    //     { blocked: !check.blocked, isVendorVerified, role: "vendor" },
    //     { new: true }
    //   );
    // }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { blocked: !check.blocked },
      { new: true }
    );

    return res.status(200).json({ message: "User Updated...", success: true });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// exports.getProfile = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     const user = await User.findOne({
//       _id: userId,
//       permanentDeleted: false,
//     }).select("-password -resetPasswordToken -forgotPasswordOtp");

//     const data = {
//       name: user.first_name,
//       ...user._doc,
//     };

//     return res.status(200).json({ success: true, data: data });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({
      _id: userId,
      permanentDeleted: false,
    }).select("-password -resetPasswordToken -forgotPasswordOtp");
    if (user.role === "admin") {
      const aggregateResult = await User.aggregate([
        {
          $group: {
            _id: null,
            totalPaymentRecieved: { $sum: "$paymentRecieved" },
            totalPaymentPending: { $sum: "$paymentPending" },
          },
        },
      ]);

      const { totalPaymentRecieved, totalPaymentPending } = aggregateResult[0];

      const data = {
        name: user.first_name,
        ...user._doc,
        totalPaymentRecieved,
        totalPaymentPending,
      };

      return res.status(200).json({ success: true, data: data });
    }

    const data = {
      name: user.first_name,
      ...user._doc,
    };

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.vendorStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    console.log(req.body);

    if (status === "blocked") {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          blocked: true,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ success: true, message: "User Blocked" });
    }
    if (status === "unblock") {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          blocked: false,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ success: true, message: "User Blocked" });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        isVendorVerified: status,
      },
      {
        new: true,
      }
    );
    if (user.isVendorVerified === "approved") {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          role: "vendor",
        },
        {
          new: true,
        }
      );
    }
    return res.status(200).json({ success: true, message: "Status Updated" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" }).select(
      "-password -resetPasswordToken -forgotPasswordOtp -fcm_token"
    );
    if (!vendor) {
      return res
        .status(400)
        .json({ success: false, message: "No Vendor By This Id" });
    }
    return res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
