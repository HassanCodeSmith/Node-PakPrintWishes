const express = require("express");
const ServiceRouter = express.Router();

const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  createService,
  getAllServices,
  deleteService,
  deleteMultipleServices,
  updateService,
} = require("../controllers/services");

ServiceRouter.get("/getAllServices", authMiddleware, adminAuth, getAllServices);
ServiceRouter.get("/user/getAllServices", getAllServices);
ServiceRouter.delete(
  "/deleteService/:serviceId",
  authMiddleware,
  adminAuth,
  deleteService
);

ServiceRouter.post(
  "/deleteMultipleServices",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultipleServices
);

ServiceRouter.post(
  "/createService",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  createService
);

ServiceRouter.patch(
  "/updateService/:serviceId",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  updateService
);

module.exports = ServiceRouter;
