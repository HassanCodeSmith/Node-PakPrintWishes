const freelancingJobRouter = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

const {
  addFreelancingJob,
  sendJobProposal,
  getAllFreelancingJobs,
  getFreelancingJobDetailsById,
  assignJobToFreelancer,
  deleteFreelancingJobById,
  updateFreelancingJobById,
  authGetAllFreelancingJobs,
  saveAndUnSaveFreelancingJob,
  getAllSaveJobs,
  getSingleSaveJob,
  changeJobStatus,
} = require("../controllers/freelancing-job.controllers");

freelancingJobRouter
  .route("/addFreelancingJob")
  .post(userAuth, adminAuth, upload.any(), addFreelancingJob);

freelancingJobRouter
  .route("/sendJobProposal/:jobId")
  .post(userAuth, upload.any(), sendJobProposal);

freelancingJobRouter
  .route("/getAllFreelancingJobs")
  .get(userAuth, getAllFreelancingJobs);

freelancingJobRouter
  .route("/authGetAllFreelancingJobs")
  .get(userAuth, adminAuth, authGetAllFreelancingJobs);

freelancingJobRouter
  .route("/getFreelancingJobDetailsById/:id")
  .get(getFreelancingJobDetailsById);

freelancingJobRouter
  .route("/assignJobToFreelancer/:jobId/:freelancerId")
  .post(userAuth, adminAuth, upload.none(), assignJobToFreelancer);

freelancingJobRouter
  .route("/deleteFreelancingJobById/:jobId")
  .post(userAuth, adminAuth, deleteFreelancingJobById);

freelancingJobRouter
  .route("/updateFreelancingJobById/:jobId")
  .post(userAuth, adminAuth, upload.any(), updateFreelancingJobById);

freelancingJobRouter
  .route("/saveAndUnSaveFreelancingJob/:jobId")
  .post(userAuth, saveAndUnSaveFreelancingJob);

freelancingJobRouter.route("/getAllSaveJobs").get(userAuth, getAllSaveJobs);

freelancingJobRouter
  .route("/getSingleSaveJob/:underScoreId")
  .get(userAuth, getSingleSaveJob);

freelancingJobRouter
  .route("/changeJobStatus/:underScoreId")
  .post(userAuth, adminAuth, upload.none(), changeJobStatus);

module.exports = freelancingJobRouter;
