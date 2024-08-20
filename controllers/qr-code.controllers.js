/** import models */
const QRCode = require("../models/qr-code.model");
const User = require("../models/user");

/**
 * Create
 */
exports.createQRCode = async (req, res) => {
  /** Get User ID */
  const { userId } = req.user;

  /** Check User Authentications */
  const user = await User.findOne({
    _id: userId,
    softDeleted: false,
    permanentDeleted: false,
    blocked: false,
  });

  /** if user not found */
  if (!user) {
    return res.status(400).json({
      success: false,
      error: "User not found or Invalid User",
    });
  }

  /** if pdf file is not provided */
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "Pdf file is required",
    });
  }

  /** save content in db */
  const newQRCodeDetails = await QRCode.create({
    ...req.body,
    createdBy: userId,
  });

  /** successs message */
  return res.status(200).json({
    success: true,
    message: "QR-Code details save successfully",
    data: newQRCodeDetails,
  });
};

/**
 * Get All QR-Code
 */
exports.getAllQRCodeDetails = async (req, res) => {
  const { userId } = req.user;

  /** get user */
  const user = await User.findOne({ _id: userId });

  /** check if userId is invalid */
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  /** check if user is blocked */
  if (user.blocked === true) {
    return res.status(400).json({
      success: false,
      message: "User is blocked by admin",
    });
  }

  /** check if user softly deleted */
  if (user.softDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "User is temporarily deleted",
    });
  }

  /** check if user permanently deleted */
  if (user.permanentDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "User permanently deleted",
    });
  }

  /** check user role */
  if (user.role !== "admin") {
    return res.status(400).json({
      success: false,
      message: "Invalid user role",
    });
  }

  /** get all qr code details */
  const allDetails = await QRCode.find({ permanentDeleted: false }).populate(
    "createdBy",
    "-password -forgotPasswordOtp -forgotPasswordOtpExpire -resetPasswordToken -resetPasswordTokenExpire"
  );

  /** if collection is empty */
  if (allDetails.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Collection is empty",
      data: allDetails,
    });
  }

  /** success message */
  return res.status(200).json({
    success: true,
    message: "Data retrived successfully",
    data: allDetails,
  });
};

/**
 * Get Single QR-Code Details
 */
exports.getQRCodeById = async (req, res) => {
  /** get user id */
  const { userId } = req.user;
  const { id } = req.params;

  /** get user */
  const user = await User.findOne({ _id: userId });

  /** check if userId is invalid */
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  /** check if user is blocked */
  if (user.blocked === true) {
    return res.status(400).json({
      success: false,
      message: "User is blocked by admin",
    });
  }

  /** check if user softly deleted */
  if (user.softDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "User is temporarily deleted",
    });
  }

  /** check if user permanently deleted */
  if (user.permanentDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "User permanently deleted",
    });
  }

  /** check user role */
  if (user.role !== "admin") {
    return res.status(400).json({
      success: false,
      message: "Invalid user role",
    });
  }

  const qrCode = await QRCode.findOne({
    _id: id,
    permanentDeleted: false,
  }).populate(
    "createdBy",
    "-password -forgotPasswordOtp -forgotPasswordOtpExpire -resetPasswordToken -resetPasswordTokenExpire"
  );

  if (!qrCode) {
    return res.status(400).json({
      success: false,
      message: "QR-Code not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Data retrived successfully",
    data: qrCode,
  });
};

/**
 * Delete QRCode
 */
exports.deleteQRCodeById = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  /** get user */
  const user = await User.findOne({ _id: userId });

  /** check if userId is invalid */
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  /** check if user is blocked */
  if (user.blocked === true) {
    return res.status(400).json({
      success: false,
      message: "User is blocked by admin",
    });
  }

  /** check if user softly deleted */
  if (user.softDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "User is temporarily deleted",
    });
  }

  /** check if user permanently deleted */
  if (user.permanentDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "User permanently deleted",
    });
  }

  /** check user role */
  if (user.role !== "admin") {
    return res.status(400).json({
      success: false,
      message: "Invalid user role",
    });
  }

  /** get QR-Code details */
  const qrCode = await QRCode.findOne({ _id: id });

  /** if qr code id is invalid */
  if (!qrCode) {
    return res.status(400).json({
      success: false,
      message: "QR=Code not found - Invalid id",
    });
  }

  /** if qr code already deleted */
  if (qrCode.permanentDeleted === true) {
    return res.status(400).json({
      success: false,
      message: "QR-Code already deleted",
    });
  }

  /** delete qr code */
  await QRCode.findOneAndUpdate(
    { _id: id },
    { $set: { permanentDeleted: true } }
  );

  /** success message */
  return res.status(200).json({
    success: true,
    message: "QR-Code deleted successfully",
  });
};
