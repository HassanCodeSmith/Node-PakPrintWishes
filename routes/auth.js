const express = require("express");
const UserRoute = express.Router();
const UserAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const {
  register,
  login,
  getUserProfile,
  updateProfile,
  verifyForgotPasswordOtp,
  forgotPassword,
  resetPassword,
  vendorLogin,
  verdorRegister,
  verifyOTP,
  updateProfileVendor,
  socialLogin,
  resendOTP,

  becomeVendor,
  getTokens,
  addVendor,
} = require("../controllers/auth");
const { upload } = require("../utils/upload");

// UserRoute.use(upload.none());

UserRoute.post("/user/register", upload.none(), register);
UserRoute.post("/login", upload.none(), login);
UserRoute.post("/getTokens", UserAuth, upload.none(), getTokens);
UserRoute.post("/socialLogin", upload.none(), socialLogin);
UserRoute.get("/getUserProfile", UserAuth, getUserProfile);
UserRoute.patch(
  "/updateProfile",
  UserAuth,
  upload.single("profileImg"),
  updateProfile
);
UserRoute.patch(
  "/vendor/updateProfile",
  UserAuth,
  upload.single("profileImg"),
  updateProfileVendor
);
UserRoute.patch("/forgotPassword", upload.none(), forgotPassword);
UserRoute.post(
  "/verifyForgotPasswordOtp",
  upload.none(),
  verifyForgotPasswordOtp
);
UserRoute.patch("/resetPassword", upload.none(), resetPassword);

//Admin//
UserRoute.post("/verdor/Login", upload.none(), vendorLogin);

UserRoute.patch("/verdor/resetPassword", upload.none(), resetPassword);
UserRoute.post(
  "/verdor/verifyForgotPasswordOtp",
  upload.none(),
  verifyForgotPasswordOtp
);
UserRoute.patch("/verdor/forgotPassword", upload.none(), forgotPassword);
//Vendor//

UserRoute.post("/verdor/register", upload.none(), verdorRegister);
UserRoute.post("/addVendor", upload.none(), UserAuth, adminAuth, addVendor);
UserRoute.post("/verdor/verifyOTP", upload.none(), verifyOTP);
UserRoute.post("/vendor/resendOTP", upload.none(), resendOTP);

UserRoute.post("/vendor/becomeVendor", upload.none(), UserAuth, becomeVendor);

module.exports = UserRoute;
