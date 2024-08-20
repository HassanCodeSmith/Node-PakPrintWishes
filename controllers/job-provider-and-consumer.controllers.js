/** Import models */
const JobProposal = require("../models/job_proposals.model");
const User = require("../models/user");

/** Import Utils */
const { validateEmail } = require("../utils/emailValidator");
const sendEmail = require("../utils/sendEmail");

/** Import custom modules */
const bcrypt = require("bcrypt");
const { trimObjects } = require("../utils/trimObjects.util");
const FreelancingJob = require("../models/freelancing-job.model");

/**
 * Register Job Provider and Consumer
 */
exports.register = async (req, res) => {
  try {
    /** Get all credentials from form-data */
    const {
      first_name,
      last_name,
      email,
      phone,
      cnic,
      role,
      bank_name,
      bank_account_number,
      password,
      confirmpassword,
      address,
    } = req.body;

    /** Check "empty" or "not provided" fields */
    if (
      !(
        first_name?.trim() &&
        last_name?.trim() &&
        email?.trim() &&
        phone?.trim() &&
        cnic?.trim() &&
        role?.trim() &&
        bank_name?.trim() &&
        bank_account_number?.trim() &&
        password?.trim() &&
        confirmpassword?.trim() &&
        address
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    /** Check if email is not valid */
    if (!validateEmail(email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    /** Check if password and confirmation password not matched */
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not matched",
      });
    }

    /** Check if user already exists */
    const user = await User.findOne({ email });

    /** Check if account deleted by admin - with provided email */
    if (user && user.permanentDeleted === true) {
      return res.status(400).json({
        success: false,
        message: "Account is deleted by admin with provided email",
      });
    }

    /** Check if account blocked by admin - with provided email */
    if (user && user.blocked === true) {
      return res.status(400).json({
        success: false,
        message: "Account is blocked with provided email",
      });
    }

    /** Check if account deleted by user itself - and recover it */
    if (user && user.softDeleted === true) {
      const oldDeletedFreelancer = await User.findOneAndUpdate(
        { _id: user._id },
        {
          first_name,
          last_name,
          email,
          phone,
          cnic,
          role,
          bank_name,
          bank_account_number,
          password,
          address,
          verified: true,
          softDeleted: false,
        },
        { new: true }
      );

      /** Generate accessToken */
      const accessToken = oldDeletedFreelancer.createJWT();

      /** Success message on Re-registeration */
      return res.status(200).json({
        success: true,
        message: "Freelancer Re-registered successfully",
        data: {
          first_name: oldDeletedFreelancer.first_name,
          last_name: oldDeletedFreelancer.last_name,
          email: oldDeletedFreelancer.email,
          accessToken,
        },
      });
    }

    /** Create new user */
    const newFreelancer = await User.create({
      first_name,
      last_name,
      email,
      phone,
      cnic,
      role,
      bank_name,
      bank_account_number,
      password,
      address,
      verified: true,
    });

    /** Generate accessToken */
    const accessToken = newFreelancer.createJWT();

    /** Success message on registration */
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        first_name: newFreelancer.first_name,
        last_name: newFreelancer.last_name,
        email: newFreelancer.email,
        accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login Job Provider and Consumer
 */
exports.login = async (req, res) => {
  try {
    console.log("Body: ", req.body);
    const { email, password } = req.body;

    /** Check "empty" or "not provided" fields */
    if (!(email?.trim() && password?.trim())) {
      return res.status(400).json({
        success: false,
        message: "Email and password must be provided",
      });
    }

    /** Check if email is not valid */
    if (!validateEmail(email)) {
      cosnole.error("Email is not valid");
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    /** Freelancer registered or not */
    const user = await User.findOne({ email });

    /** if freelancer not registered */
    if (!user) {
      console.error("Invalid email");
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    /** if freelancer blocked by admin */
    if (user.blocked) {
      console.error("Account is blocked by admin");
      return res.status(400).json({
        success: false,
        message: "Account is blocked by admin",
      });
    }

    /** if freelancer already delete it's account */
    if (user.softDeleted) {
      console.error("Account is deleted by freelancer");
      return res.status(400).json({
        success: false,
        message: "Account is deleted by freelancer",
      });
    }

    /** if freelancer account deleted by admin */
    if (user.permanentDeleted) {
      console.error("Account doesn't found");
      return res.status(400).json({
        success: false,
        message: "Account doesn't found",
      });
    }

    /** Check if password is correct */
    if (!(await user.comparePassword(password))) {
      console.error("Invalid email or password");
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /** Generate accessToken */
    const accessToken = user.createJWT();
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      accessToken,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Profiler By Id - Locally After Login
 */
exports.localGetProfileById = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      console.log("Invalid ID");
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    console.log(user);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Profile Locally
 */
exports.localUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      console.log("Invalid ID");
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const updatedFields = {};

    if (req.body.first_name) {
      updatedFields.first_name = req.body.first_name;
    } else {
      updatedFields.first_name = user.first_name;
    }

    if (req.body.last_name) {
      updatedFields.last_name = req.body.last_name;
    } else {
      updatedFields.last_name = user.last_name;
    }

    if (req.body.email) {
      updatedFields.email = req.body.email;
    } else {
      updatedFields.email = user.email;
    }

    if (req.body.phone) {
      updatedFields.phone = req.body.phone;
    } else {
      updatedFields.phone = user.phone;
    }

    if (req.body.cnic) {
      updatedFields.cnic = req.body.cnic;
    } else {
      updatedFields.cnic = user.cnic;
    }

    if (req.body.bank_name) {
      updatedFields.bank_name = req.body.bank_name;
    } else {
      updatedFields.bank_name = user.bank_name;
    }

    if (req.body.bank_account_number) {
      updatedFields.bank_account_number = req.body.bank_account_number;
    } else {
      updatedFields.bank_account_number = user.bank_account_number;
    }

    if (req.body.address) {
      updatedFields.address = req.body.address;
    } else {
      updatedFields.address = user.address;
    }

    if (req.file) {
      const profileImg = req.file.location.replace(/.*\/uploads/, "/uploads");
      updatedFields.profileImg = profileImg;
    } else {
      updatedFields.profileImg = user?.profileImg;
    }

    const updatedFreelancer = await User.findOneAndUpdate(
      { _id: userId },
      updatedFields,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "user profile updated successfully",
      data: updatedFreelancer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Account Locally
 */
exports.localDeleteAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { softDeleted: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
 * OTP Verification
 */
exports.OTPVerfication = async (req, res) => {
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
      return res
        .status(400)
        .json({ success: false, message: "you are not allowed to do that" });
    }

    let { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password don't match" });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
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

/**
 * Delete User Account by Admin
 */
exports.authDeleteAccountById = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      console.log("Invalid ID");
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    if (user.softDeleted === true) {
      console.log("This account deleted by user");
      return res.status(400).json({
        success: false,
        message: "This account deleted by user",
      });
    }

    if (user.permanentDeleted === true) {
      console.log("This account already has been deleted");
      return res.status(400).json({
        success: false,
        message: "This account already has been deleted",
      });
    }

    const deletedFreelancer = await User.findOneAndUpdate(
      { _id: id },
      { permanentDeleted: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "user delete",
      data: deletedFreelancer,
    });
  } catch (error) {}
};

/**
 * Block user Account by Admin
 */
exports.authBlockAccountById = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    const blockedFreelancer = await User.findOneAndUpdate(
      { _id: id, softDeleted: false, permanentDeleted: false },
      { blocked: true },
      { new: true }
    ).select("-password");

    if (!blockedFreelancer) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: blockedFreelancer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Un-Block Users Account by Admin
 */
exports.authUnBlockAccountById = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;

    const unBlockedFreelancer = await User.findOneAndUpdate(
      { _id: id, softDeleted: false, permanentDeleted: false },
      { blocked: false },
      { new: true }
    ).select("-password");

    if (!unBlockedFreelancer) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User un-blocked successfully",
      data: unBlockedFreelancer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Users by Role
 */
exports.authGetAllProfilesByRole = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { role } = req.params;

    const users = await User.find({
      role,
      softDeleted: false,
      permanentDeleted: false,
    }).select("-password");

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Collection list is empty",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Freelancer Profiler By Id
 */
exports.authGetProfileById = async (req, res) => {
  try {
    const userRole = req.role;

    if (userRole !== "admin") {
      console.log("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { id } = req.params;
    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
      console.log("Invalid ID");
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add Experience
 */
exports.addExperience = async (req, res) => {
  try {
    const { userId } = req.user;

    const { experience } = req.body;

    const updatedData = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { experience: experience } },
      { new: true }
    );

    console.log("==> updatedData after adding experience: ", updatedData);
    return res.status(200).json({
      success: true,
      message: "Experience added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * User Validation
 */
const userValidation = async (user) => {
  if (user.blocked) {
    return { status: false, message: "User with this email is blocked" };
  } else if (user.softDeleted) {
    return { status: false, message: "User is temporarily deleted" };
  } else if (user.permanentDeleted) {
    return { status: false, message: "User is permanently deleted" };
  } else {
    return { status: true, message: "User is valid" };
  }
};
