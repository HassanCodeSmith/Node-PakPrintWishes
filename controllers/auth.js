const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const CustomAPIError = require("../errors/customApi");
const bcrypt = require("bcrypt");
const OTP = require("../models/otp");
const sendEmail = require("../utils/sendEmail");
const sendNotification = require("../utils/sendNotificatoin");
const Wallet = require("../models/wallet");
const otpEmail = require("../templates/otp");
const newVendorRegistered = require("../templates/newVendorRegistered");
const Notification = require("../models/notification");
const CryptoJS = require("crypto-js");
const { secretKey } = require("../constants");

const { validateEmail } = require("../utils/emailValidator");

const CLIENT_ID =
  "141583905035-b3s65qca6n62q6kc4d235mp59rjs0sru.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

/**
 * Social Login
 */
exports.socialLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    console.log(">>>>>", ticket);
    const payload = ticket.getPayload();
    const email = payload.email;
    const picture = payload.picture;
    const given_name = payload.given_name;
    // const family_name = payload.family_name;
    const password = payload.sub;
    // console.log(email);
    if (!payload.email_verified) {
      return res
        .status(400)
        .json({ success: false, msg: "Your Email is Not Verified" });
    }
    let find = await User.findOne({ email });
    console.log(find === null);
    if (find !== null) {
      if (find.blocked) {
        return res.status(400).json({
          success: false,
          message: "You have been blocked by admin...!",
        });
      }
    }
    // console.log(find);
    if (find !== null) {
      if (find.permanentDeleted) {
        find = await User.findByIdAndUpdate(find._id, {
          first_name: given_name,
          // last_name: family_name,
          email,
          // image: picture,
          password,
          isSocialLogin: true,
          permanentDeleted: false,
        });
      }
      const acc_token = await find.createJWT();
      return res.status(200).json({
        success: true,
        data: {
          first_name: find.first_name,
          last_name: find.last_name,
          email: find.email,
          role: find.role,

          // verified: find.verified,
        },
        token: acc_token,
      });
    }
    const data = await User.create({
      first_name: given_name,
      last_name: "",
      email,
      verified: false,
      permanentDeleted: false,
      // image: picture,
      password,
      isSocialLogin: true,
    });
    const acc_token = await data.createJWT();
    console.log("data", data);
    return res.status(200).json({
      success: true,
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        // verified: find.verified,
      },
      token: acc_token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Register
 */
exports.register = async (req, res) => {
  console.log("Register Bodyyyyyyyyyyyyy: ", req.body);
  try {
    let { first_name, last_name, email, phone, country, state, city, address } =
      req.body;
    email = email?.toLowerCase();
    const { password, confirmpassword } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide first name, last name and email.",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }
    console.log("__Password__", password);
    console.log("__Confirm Password__", confirmpassword);

    if (!password || !confirmpassword) {
      console.log("__Password and confirmation required__");
      return res.status(400).json({
        success: false,
        message: "Password and confirmation required",
      });
    }

    let decryptedPassword = CryptoJS.AES.decrypt(password, secretKey);
    decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    console.log("__Decrypted Password__", decryptedPassword);

    let decryptedConfirmPassword = CryptoJS.AES.decrypt(
      confirmpassword,
      secretKey
    );
    decryptedConfirmPassword = decryptedConfirmPassword.toString(
      CryptoJS.enc.Utf8
    );
    console.log("__Decrypted Confirm Password__", decryptedPassword);

    if (decryptedPassword !== decryptedConfirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password is Not Matched",
      });
    }
    const find = await User.findOne({ email });
    // if user is permanently deleeted
    if (find && find.permanentDeleted === true) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(decryptedPassword, salt);
      const oldDeletedUser = await User.findOneAndUpdate(
        { _id: find._id },
        {
          first_name,
          last_name,
          email,
          verified: false,
          phone,
          country,
          state,
          city,
          address,
          password: hashedPassword,
          permanentDeleted: false,
        },
        { new: true }
      );
      const token = oldDeletedUser.createJWT();
      return res.status(200).json({
        data: {
          first_name: oldDeletedUser.first_name,
          last_name: oldDeletedUser.last_name,
          email: oldDeletedUser.email,
          token,
        },
        token,
      });
    } else if (find && find.permanentDeleted === false) {
      return res.status(400).json({
        success: false,
        message: "Email address is already taken.",
      });
    } else {
      const newUser = await User.create({
        first_name,
        last_name,
        email,
        phone,
        country,
        state,
        city,
        address,
        password: decryptedPassword,
      });
      const token = newUser.createJWT();
      res.status(200).json({
        data: {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          token,
        },
        token,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
  //   // console.log(err);
  //   let customError = {
  //     // set default
  //     statusCode: err.statusCode || 500,
  //     msg: err.message || "Something went wrong try again later",
  //   };
  //   if (err.name === "ValidationError") {
  //     customError.msg = Object.values(err.errors)
  //       .map((item) => item.message)
  //       .join(",");
  //     customError.statusCode = 400;
  //   }
  //   if (err.code && err.code === 11000) {
  //     // 11000 is an error code for duplcate email
  //     customError.msg = `${Object.keys(err.keyValue)} already exist`;
  //     customError.statusCode = 400;
  //   }
  //   return res
  //     .status(customError.statusCode)
  //     .json({ status: false, message: customError.msg });
  // }
};

/**
 * Login
 */
exports.login = async (req, res) => {
  try {
    console.log("login body: ", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Please Provide Email & Password");
      throw new CustomAPIError("Please Provide Email & Password", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user exist with this email");
      throw new CustomAPIError("No user exist with this email", 404);
    }
    if (user && user.softDeleted === true) {
      console.log(
        "The user has already deleted their account with the provided email."
      );
      throw new CustomAPIError(
        "The user has already deleted their account with the provided email.",
        404
      );
    }
    if (user && user.permanentDeleted === true) {
      console.log("No user exist with this email");
      throw new CustomAPIError("No user exist with this email", 404);
    }
    console.log("__Password:", password);
    let decryptedPassword = CryptoJS.AES.decrypt(password, secretKey);
    decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    console.log("__Decrypted Password:", decryptedPassword);
    const correctPassword = await user.comparePassword(decryptedPassword);
    if (!correctPassword) {
      throw new CustomAPIError("Wrong Password...", 401);
    }
    if (user.blocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }
    const token = user.createJWT();
    return res.status(200).json({
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
      token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get User Profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const check = await User.findById(userId);
    if (!check) {
      return res.status(200).json({ success: false, message: "No User Found" });
    }

    const profileData = await User.findOne({ _id: userId });
    console.log(profileData);
    return res.status(200).json({
      success: true,
      data: {
        // role: profileData.role,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        address: profileData.address,
        state: profileData.state,
        city: profileData.city,
        phoneNo: profileData.phone,
        country: profileData.country,
        role: profileData.role,
        _id: profileData._id,
        profileImg: profileData.profileImg,
        isVendorVerified: profileData.isVendorVerified,
        email: profileData.email,
        verified: profileData.verified,
        OTPStatus: profileData.OTPStatus,
        paymentRecieved: profileData.paymentRecieved,
        paymentPending: profileData.paymentPending,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update Profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { first_name, last_name, phone, country, state, city, address } =
      req.body;
    console.log(req.body);
    const check = await User.findById(userId);
    if (!check) {
      return res.status(200).json({ success: false, message: "No User Found" });
    }
    if (
      !first_name ||
      !last_name ||
      !phone ||
      !country ||
      !state ||
      !city ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all required fields" });
    }
    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

      const profileImg = relativePath;
      await User.findOneAndUpdate(
        { _id: userId },
        {
          first_name,
          last_name,
          phone,
          country,
          state,
          city,
          address,
          profileImg,
        }
      );

      const updatedUser = await User.findById(userId).select("-password");

      return res.status(200).json({
        success: true,
        message: "Profile Has Been Updated",
        data: {
          // role: profileData.role,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          address: updatedUser.address,
          state: updatedUser.state,
          city: updatedUser.city,
          phoneNo: updatedUser.phone,
          country: updatedUser.country,
          profileImg: updatedUser.profileImg,
          email: updatedUser.email,
        },
      });
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        { first_name, last_name, phone, country, state, city, address }
      );

      const updatedUser = await User.findById(userId).select("-password");

      return res.status(200).json({
        success: true,
        message: "Profile Has Been Updated",
        data: {
          // role: profileData.role,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          address: updatedUser.address,
          state: updatedUser.state,
          city: updatedUser.city,
          phoneNo: updatedUser.phone,
          country: updatedUser.country,
          profileImg: updatedUser.profileImg,
          email: updatedUser.email,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update Vendor Profile
 */
exports.updateProfileVendor = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      first_name,
      last_name,
      phone,
      companyName,
      bank_name,
      bank_account_number,
      cnic,
      address,
    } = req.body;
    console.log(req.body);
    const check = await User.findById(userId);
    if (!check) {
      return res.status(200).json({ success: false, message: "No User Found" });
    }
    if (
      !first_name ||
      !last_name ||
      !phone ||
      !companyName ||
      !bank_name ||
      !bank_account_number ||
      !cnic ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all required fields" });
    }
    if (req.file) {
      const relativePath = req.file.location.replace(/.*\/uploads/, "/uploads");

      const profileImg = relativePath;

      const profileUpdate = await User.findOneAndUpdate(
        { _id: userId },
        {
          first_name,
          last_name,
          phone,
          companyName,
          bank_name,
          bank_account_number,
          cnic,
          address,
          profileImg,
        },
        { new: true }
      );
      console.log(profileUpdate);
      return res.status(200).json({
        success: true,
        message: "Profile Has Been Updated",
        //   data: profileUpdate,
      });
    } else {
      const profileUpdate = await User.findOneAndUpdate(
        { _id: userId },
        {
          first_name,
          last_name,
          phone,
          companyName,
          bank_name,
          bank_account_number,
          cnic,
          address,
          profileImg: check.profileImg,
        },
        { new: true }
      );
      console.log(profileUpdate);
      return res.status(200).json({
        success: true,
        message: "Profile Has Been Updated",
        //   data: profileUpdate,
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Forgot Password
 */
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    console.log(req.body);
    email = email?.toLowerCase();
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email is required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const checkfp = await User.findOne({ email });
    if (!checkfp) {
      return res
        .status(400)
        .json({ success: false, message: "No User found with email address" });
    }
    if (checkfp && checkfp.permanentDeleted === true) {
      return res
        .status(400)
        .json({ success: false, message: "No User found with email address" });
    }

    const forgotPasswordOtp = (
      Math.floor(Math.random() * 899999) + 100000
    ).toString();

    console.log(forgotPasswordOtp);
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(forgotPasswordOtp, salt);
    await User.findOneAndUpdate(
      { email },
      {
        forgotPasswordOtp: hashedOtp,
        forgotPasswordOtpExpire: Date.now() + 5 * 60 * 1000,
      }
    );
    const htmlCode = `<p>Dear User,</p>
        <p>Your One-Time Password (OTP) is <strong>${forgotPasswordOtp}</strong>.</p>
        <p>Please use this OTP to complete your authentication process.</p>
        <p>Thank you,</p>`;
    sendEmail({
      to: email,
      subject: `Please check your email to forgot your password.`,
      html: htmlCode,
    });
    return res
      .status(200)
      .json({ success: true, message: "Otp Has been sent your email" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error });
  }
};

/**
 * Verify Forgot Password OTP (One Time Password)
 */
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    let { email, forgotPasswordOtp } = req.body;

    // console.log(email, forgotPasswordOtp);
    email = email?.toLowerCase();
    // console.log(email);
    if (!forgotPasswordOtp) {
      return res.status(400).json({ message: "Otp cannot be blank" });
    }
    // verifying user
    const user = await User.findOne({
      email,
      forgotPasswordOtpExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ message: "session expired" });
    }

    // comparing otp
    const valid = await user.campareForgotPasswordOtp(forgotPasswordOtp);

    console.log(valid);
    if (valid) {
      await User.findOneAndUpdate(
        { email },
        {
          setNewPwd: true,
          forgotPasswordOtp: "",
        }
      );
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    }
    return res.status(400).json({ message: "Invalid OTP" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    let { email } = req.body;

    email = email?.toLowerCase();
    const oldUser = await User.findOne({ email });

    if (!oldUser.setNewPwd) {
      console.log("you are not allowed to do that");
      return res
        .status(400)
        .json({ success: false, message: "you are not allowed to do that" });
    }

    let { password, confirmPassword } = req.body;

    console.log("__Password:", password);
    console.log("__Confirm Password:", confirmPassword);

    let decryptedPassword = CryptoJS.AES.decrypt(password, secretKey);
    decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    let decryptedConfirmPassword = CryptoJS.AES.decrypt(
      confirmPassword,
      secretKey
    );
    decryptedConfirmPassword = decryptedConfirmPassword
      .toString(CryptoJS.enc.Utf8)
      .trim();

    console.log("__Decrypted Password:", decryptedPassword);
    console.log("__Decrypted Confirm Password:", decryptedConfirmPassword);

    if (decryptedPassword !== decryptedConfirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password don't match" });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(decryptedPassword, salt);
    const user = await User.findOneAndUpdate(
      { email },
      { password, setNewPwd: false }
    );

    return res
      .status(200)
      .json({ success: true, message: "New password successfully updated" });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ success: false, message: error.message });
  }
};

/** _____ Vendor _____ */
/**
 * Vendor Login
 */
exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("__Email or password cannot be empty");
      return res
        .status(403)
        .json({ success: false, message: "Email or password cannot be empty" });
    }

    if (!validateEmail(email)) {
      console.log("__Please enter a valid email address");
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const find = await User.findOne({ email });
    console.log(find);
    if (!find) {
      console.log("__No vendor found with provided email");
      return res.status(404).json({
        success: false,
        message: "No vendor found with provided email",
      });
    }

    if (find && find.permanentDeleted === true) {
      return res.status(404).json({
        success: false,
        message: "Vendor deleted with provided email",
      });
    }

    let decryptedPassword = CryptoJS.AES.decrypt(password, secretKey);
    decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    console.log("__Decrypted Password:", decryptedPassword);
    const isPassword = await find.comparePassword(decryptedPassword);
    console.log(isPassword);
    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }

    if (find.blocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
        blocked: find.blocked,
      });
    }
    if (find.role === "user") {
      if (!find.verified && find.OTPStatus === "requested") {
        const otp = Math.floor(Math.random() * 899999) + 100000;
        console.log("OTP: " + otp);

        await OTP.deleteMany({ email });

        await OTP.create({ email, otp });

        const htmlCode = otpEmail(otp);
        sendEmail({
          to: find.email,
          subject: `Please check your email to verify your account.`,
          html: htmlCode,
        });
        return res.status(200).json({
          success: true,
          data: {
            firstName: find.first_name,
            first_name: find.first_name,
            lastName: find.last_name,
            last_name: find.last_name,
            _id: find._id,
            role: find.role,
            email: find.email,
            verified: find.verified,
            isVendorVerified: find.isVendorVerified,
            OTPStatus: find.OTPStatus,
          },
        });
      }
    }
    if (find.isVendorVerified === "pending") {
      return res.status(200).json({
        success: true,
        message: "Waiting for admin approval",
        data: {
          firstName: find.first_name,
          first_name: find.first_name,
          lastName: find.last_name,
          last_name: find.last_name,
          _id: find._id,
          role: find.role,
          email: find.email,
          verified: find.verified,
          isVendorVerified: find.isVendorVerified,
          OTPStatus: find.OTPStatus,
        },
      });
    }
    if (find.isVendorVerified === "rejected") {
      return res.status(200).json({
        success: true,
        message: "Your account is Rejected by Admin",
        data: {
          firstName: find.first_name,
          first_name: find.first_name,
          lastName: find.last_name,
          last_name: find.last_name,
          _id: find._id,
          role: find.role,
          email: find.email,
          verified: find.verified,
          isVendorVerified: find.isVendorVerified,
          OTPStatus: find.OTPStatus,
        },
      });
    }
    // if (find.isVendorVerified === "block") {
    //   return res.status(400).json({
    //     success: true,
    //     message: "Your account is block by Admin",
    //     isVendorVerified: find.isVendorVerified,
    //   });
    // }

    const token = await find.createJWT();
    console.log(find.isVendorVerified);

    return res.status(200).json({
      success: true,
      message: "Login successfull",
      access_token: token,
      data: {
        firstName: find.first_name,
        first_name: find.first_name,
        lastName: find.last_name,
        last_name: find.last_name,
        _id: find._id,
        role: find.role,
        email: find.email,
        verified: find.verified,
        isVendorVerified: find.isVendorVerified,
        OTPStatus: find.OTPStatus,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Add Vendor
 */
exports.addVendor = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      email,
      phone,
      companyName,
      bank_name,
      bank_account_number,
      cnic,
      address,
    } = req.body;

    email = email?.toLowerCase();
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !companyName ||
      !bank_name ||
      !bank_account_number ||
      !cnic ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Fill require fields" });
    }
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }
    const { password, confirmpassword } = req.body;
    if (!password || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmation required",
      });
    }
    let decryptedPassword = CryptoJS.AES.decrypt(password, secretKey);
    decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    console.log("__Decrypted Password:", decryptedPassword);

    let decryptedConfirmPassword = CryptoJS.AES.decrypt(
      confirmpassword,
      secretKey
    );
    decryptedConfirmPassword = decryptedConfirmPassword.toString(
      CryptoJS.enc.Utf8
    );
    console.log("__Decrypted Confirm Password:", decryptedPassword);
    if (decryptedPassword !== decryptedConfirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password is Not Matched",
      });
    }
    const find = await User.findOne({ email: req.body.email });
    let vendor;

    if (req.role === "admin" && find && find.permanentDeleted === true) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(decryptedPassword, salt);
      vendor = await User.findOneAndUpdate(
        { _id: find._id },
        {
          first_name,
          last_name,
          email,
          phone,
          companyName,
          bank_name,
          bank_account_number,
          cnic,
          address,
          password: hashedPassword,
          role: "vendor",
          permanentDeleted: false,
          verified: true,
          blocked: false,
          OTPStatus: "approved",
          isVendorVerified: "approved",
        }
      );
      const findWallet = await Wallet.findOne({ vendor: vendor._id });
      if (!findWallet) {
        await Wallet.create({ vendor: vendor._id });
      }
      return res
        .status(200)
        .json({ success: true, message: "Vendor Created...!" });
    }
    if (req.role === "admin") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(decryptedPassword, salt);
      vendor = await User.create({
        first_name,
        last_name,
        email,
        phone,
        companyName,
        bank_name,
        bank_account_number,
        cnic,
        address,
        password: hashedPassword,
        role: "vendor",
        permanentDeleted: false,
        verified: true,
        blocked: false,
        OTPStatus: "approved",
        isVendorVerified: "approved",
      });
      const findWallet = await Wallet.findOne({ vendor: vendor._id });
      if (!findWallet) {
        await Wallet.create({ vendor: vendor._id });
      }
      return res
        .status(200)
        .json({ success: true, message: "Vendor Created...!" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Vendor Register
 */
exports.verdorRegister = async (req, res) => {
  try {
    console.log("Vendor Register Bodyyyyyyyyyyyyy: ", req.body);
    let {
      first_name,
      last_name,
      email,
      phone,
      companyName,
      bank_name,
      bank_account_number,
      cnic,
      address,
    } = req.body;

    email = email?.toLowerCase();
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !companyName ||
      !bank_name ||
      !bank_account_number ||
      !cnic ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Fill require fields" });
    }
    if (!validateEmail(req.body.email)) {
      console.log("==> Email is not valid");
      return res.status(400).json({
        status: "error",
        message: "Email is not valid",
      });
    }

    const isEmailExists = await User.findOne({
      email,
      permanentDeleted: false,
    });
    if (isEmailExists) {
      return res.status(409).json({
        success: false,
        message: "Email alrady taken",
      });
    }
    const { password } = req.body;
    console.log("__Encrypted Password:", password);
    let decryptedPassword = CryptoJS.AES.decrypt(password, secretKey);
    decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
    console.log("__Decrypted Password:", decryptedPassword);
    if (!decryptedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const find = await User.findOne({ email: req.body.email });
    let vendor;
    if (find && find.permanentDeleted === true) {
      const salt = await bcrypt.genSalt(10);
      console.log("__Hello, I am decrypted password:", decryptedPassword);
      const hashedPassword = await bcrypt.hash(decryptedPassword, salt);
      console.log("__Hello, I am hashed password:", decryptedPassword);
      vendor = await User.findOneAndUpdate(
        { _id: find._id },
        {
          first_name,
          last_name,
          email,
          phone,
          companyName,
          bank_name,
          bank_account_number,
          cnic,
          address,
          password: hashedPassword,
          role: "user",
          permanentDeleted: false,
          verified: false,
          blocked: false,
          OTPStatus: "requested",
        }
      );
      const findWallet = await Wallet.findOne({ vendor: vendor._id });
      if (!findWallet) {
        await Wallet.create({ vendor: vendor._id });
      }
    } else {
      vendor = await User.create({
        first_name,
        last_name,
        email,
        phone,
        companyName,
        bank_name,
        bank_account_number,
        cnic,
        address,
        password: decryptedPassword,
        role: "vendor",
        OTPStatus: "requested",
      });
      await Wallet.create({ vendor: vendor._id });
    }

    const otp = Math.floor(Math.random() * 899999) + 100000;
    console.log("OTP: " + otp);

    await OTP.deleteMany({ email });

    await OTP.create({ email, otp });

    // const token = vendor.createJWT();
    const htmlCode = otpEmail(otp);
    sendEmail({
      to: vendor.email,
      subject: `Please check your email to verify your account.`,
      html: htmlCode,
    });

    console.log("==> OTP has been sent to your email address");
    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address",
    });
  } catch (err) {
    console.log(err);
    let customError = {
      // set default
      statusCode: err.statusCode || 500,
      msg: err.message || "Something went wrong try again later",
    };
    if (err.name === "ValidationError") {
      customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(",");
      customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
      // 11000 is an error code for duplcate email
      customError.msg = `${Object.keys(err.keyValue)} already exist`;
      customError.statusCode = 400;
    }
    return res
      .status(customError.statusCode)
      .json({ status: false, message: customError.msg });
  }
};

/**
 * Resend OTP
 */
exports.resendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    console.log("req.body", req.body);
    email = email?.toLowerCase();
    const find = await User.findOne({ email });
    if (!find) {
      console.log("No user exist with given email");
      return res
        .status(404)
        .json({ success: false, message: "No user exist with given email" });
    }
    const otp = Math.floor(Math.random() * 899999) + 100000;
    console.log("OTP: " + otp);

    await OTP.deleteMany({ email });

    await OTP.create({ email, otp });

    const htmlCode = otpEmail(otp);
    sendEmail({
      to: email,
      subject: `Please check your email to verify your account.`,
      html: htmlCode,
    });

    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Verify OTP
 */
exports.verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    console.log("req.body", req.body);
    email = email?.toLowerCase();
    const findOtp = await OTP.findOne({ email: email });
    console.log("findOtp", findOtp);
    if (!findOtp) {
      return res.status(400).json({ success: false, message: "OTP expired." });
    }
    const isOtpValid = await findOtp.campareOtp(otp);
    if (!isOtpValid) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is invalid" });
    }
    await OTP.deleteMany({ email });
    const user = await User.findOneAndUpdate(
      { email },
      { verified: true, isVendorVerified: "pending", OTPStatus: "approved" },
      { new: true }
    );
    const token = user.createJWT();

    const admins = await User.find({ role: "admin" });

    admins.forEach(async (admin) => {
      const adminTemplate = newVendorRegistered(
        admin.first_name,
        user.first_name,
        user.email,
        user.phone
      );
      sendEmail({
        to: admin.email,
        subject: `${user.first_name} has submitted requested to become vendor.`,
        html: adminTemplate,
      });
      const notification = await Notification.create({
        reciever: admin._id,
        userId: user._id,
        title: "New Vendor Registered.",
        body: `${user.first_name} has submitted request to become vendor.`,
        type: "vendorRegister",
      });
      console.log(notification);
    });

    return res.status(200).json({
      success: true,
      access_token: token,
      message: "OTP verify Successfully",
      message: "Your Vendor Request Is Pending For Admin Approval Thank You!",
      data: {
        FirstName: user.first_name,
        LastName: user.last_name,
        email: user.email,
        Role: user.role,
        token,
        isVendorVerified: user.isVendorVerified,
      },
    });
  } catch (error) {
    console.log("error:", error);

    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Become Vendor
 */
exports.becomeVendor = async (req, res) => {
  try {
    const { userId } = req.user;
    // console.log(req.user);
    const check = await User.findById(userId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Go get Register First" });
    }

    const { email } = check;
    const {
      phone,
      companyName,
      bank_name,
      bank_account_number,
      cnic,
      address,
    } = req.body;

    const vendor = await User.findOneAndUpdate(
      { _id: userId },
      {
        phone: phone ? phone : check.phone,
        companyName,
        bank_name,
        bank_account_number,
        cnic,
        address: address ? address : check.address,
        role: "user",
        OTPStatus: "requested",
        isVendorVerified: "",
      },
      { new: true }
    );

    const findWallet = await Wallet.findOne({ vendor: vendor._id });
    if (!findWallet) {
      await Wallet.create({ vendor: vendor._id });
    }

    if (!vendor.verified) {
      const otp = Math.floor(Math.random() * 899999) + 100000;
      console.log("OTP: " + otp);

      await OTP.deleteMany({ email });

      await OTP.create({ email, otp });
      // const token = vendor.createJWT();
      const htmlCode = otpEmail(otp);
      console.log("Please check your email to verify your account.");
      sendEmail({
        to: vendor.email,
        subject: `Please check your email to verify your account.`,
        html: htmlCode,
      });
      return res.status(200).json({
        success: true,
        message: "Otp Has Been Send To Your Emails",
        verified: false,
      });
    } else {
      return res.status(200).json({
        success: true,
        verified: true,
        isVendorVerified: "pending",
        message: "Your Vendor Request Is Pending For Admin Approval!",
      });
    }
  } catch (error) {
    console.log("error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** _____ Universal _____ */
/**
 * Get Tokens
 */
exports.getTokens = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fcm_token } = req.body;
    console.log("req.body", req.body);
    const userCheck = await User.findById(userId);
    // console.log(userCheck._id);
    const token = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { fcm_token } },
      { new: true }
    );
    // console.log(token);
    return res.status(200).json({ success: true, message: "Tokken Added" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
