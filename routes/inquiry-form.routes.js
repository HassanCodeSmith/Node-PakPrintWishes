const InquiryFormRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

const {
  createInquiryForm,
  getInquiryFormById,
  getAllInquiryForms,
  updateInquiryForm,
  deleteInquiryForm,
  changeInquiryFormStatus,
} = require("../controllers/inquiry-form.controllers");

InquiryFormRouter.post(
  "/createInquiryForm",
  userAuth,
  upload.none(),
  createInquiryForm
);

InquiryFormRouter.get(
  "/getAllInquiryForms",
  userAuth,
  adminAuth,
  upload.none(),
  getAllInquiryForms
);

InquiryFormRouter.get(
  "/getInquiryFormById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  getInquiryFormById
);

InquiryFormRouter.patch(
  "/deleteInquiryForm/:id",
  userAuth,
  adminAuth,
  upload.none(),
  deleteInquiryForm
);

InquiryFormRouter.patch(
  "/changeInquiryFormStatus/:id",
  userAuth,
  adminAuth,
  upload.none(),
  changeInquiryFormStatus
);

module.exports = InquiryFormRouter;
