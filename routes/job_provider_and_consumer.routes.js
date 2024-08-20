const router = require("express").Router();

const {
  register,
  login,
  localGetProfileById,
  localUpdateProfile,
  localDeleteAccount,
  authDeleteAccountById,
  authBlockAccountById,
  authUnBlockAccountById,
  authGetAllProfilesByRole,
  authGetProfileById,
  forgotPassword,
  OTPVerfication,
  resetPassword,
  addExperience,
} = require("../controllers/job-provider-and-consumer.controllers");

const { upload } = require("../utils/upload");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

/** Routes for Freelancer */
router.route("/register").post(upload.none(), register);

router.route("/login").post(upload.none(), login);

router.route("/localGetProfileById").get(userAuth, localGetProfileById);

router
  .route("/localUpdateProfile")
  .post(userAuth, upload.single("profileImg"), localUpdateProfile);

router.route("/localDeleteAccount").post(userAuth, localDeleteAccount);

router.route("/forgotPassword").post(upload.none(), forgotPassword);

router.route("/OTPVerfication").post(upload.none(), OTPVerfication);

router.route("/resetPassword").post(upload.none(), resetPassword);

/** Routes for Admin */
router
  .route("/authDeleteAccountById/:id")
  .post(userAuth, adminAuth, authDeleteAccountById);

router
  .route("/authBlockAccountById/:id")
  .post(userAuth, adminAuth, authBlockAccountById);

router
  .route("/authUnBlockAccountById/:id")
  .post(userAuth, adminAuth, authUnBlockAccountById);

router
  .route("/authGetAllProfilesByRole/:role")
  .get(userAuth, adminAuth, authGetAllProfilesByRole);

router
  .route("/authGetProfileById/:id")
  .get(userAuth, adminAuth, authGetProfileById);

router.route("/addExperience").post(userAuth, upload.none(), addExperience);

module.exports = router;
