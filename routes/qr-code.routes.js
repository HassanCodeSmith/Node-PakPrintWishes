/** create router instance */
const router = require("express").Router();

/** import models */
const {
  createQRCode,
  getAllQRCodeDetails,
  getQRCodeById,
  deleteQRCodeById,
} = require("../controllers/qr-code.controllers");

/** import middlewares */
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

/** upload utils */
const { upload } = require("../utils/upload");

// create
router.route("/create").post(userAuth, upload.single("pdffile"), createQRCode);

// get all qr code details
router
  .route("/getAllQRCodeDetails")
  .get(userAuth, adminAuth, getAllQRCodeDetails);

// get qr code by id
router.route("/getQRCodeById/:id").get(userAuth, adminAuth, getQRCodeById);

// delete qr code by id
router
  .route("/deleteQRCodeById/:id")
  .post(userAuth, adminAuth, deleteQRCodeById);

module.exports = router;
