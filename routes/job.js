const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  deleteMultipleJobs,
  getAllJobsPublic,
  getJob,
  searchJobs,
} = require("../controllers/job");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

router.post("/createJob", authMiddleware, adminAuth, upload.none(), createJob);
router.post(
  "/deleteMultipleJobs",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultipleJobs
);
router.get("/user/getAllJobs", getAllJobsPublic);
router.get("/user/searchJobs", searchJobs);
router.get("/user/getJob/:id", getJob);
router.get("/getAllJobs", authMiddleware, adminAuth, getAllJobs);
router.delete("/deleteJob/:jobId", authMiddleware, adminAuth, deleteJob);
router.patch(
  "/updateJob/:jobId",
  authMiddleware,
  adminAuth,
  upload.none(),
  updateJob
);

module.exports = router;
