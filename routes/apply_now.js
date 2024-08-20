const express = require("express");
const ApplyNowRouter = express.Router();

const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const {
  applyForJob,
  applicationForJob,
  deleteApplication,
  deleteMultipleApplications,
} = require("../controllers/apply_now");

ApplyNowRouter.post("/user/applyForJob", upload.single("file"), applyForJob);
ApplyNowRouter.post(
  "/deleteMultipleApplications",
  upload.none(),
  deleteMultipleApplications
);
ApplyNowRouter.get(
  "/applicationForJob/:jobId",
  authMiddleware,
  adminAuth,
  applicationForJob
);
ApplyNowRouter.delete(
  "/deleteApplication/:applicationId",
  authMiddleware,
  adminAuth,
  deleteApplication
);

module.exports = ApplyNowRouter;
