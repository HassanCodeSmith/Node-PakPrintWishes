const express = require("express");
const AccessoriesRouter = express.Router();
const UserAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const {
  addAccessories,
  getAllAccessories,
  getAccessory,
  updateAccessory,
  deleteAccessory,
} = require("../controllers/accessories");
const { upload } = require("../utils/upload");

AccessoriesRouter.post(
  "/addAccessories",
  upload.any(),
  UserAuth,
  adminAuth,
  addAccessories
);
AccessoriesRouter.get("/getAllAccessories", getAllAccessories);
AccessoriesRouter.get("/getAccessory/:accessoryId", getAccessory);
AccessoriesRouter.patch(
  "/updateAccessory/:accessoryId",
  upload.any(),
  updateAccessory
);
AccessoriesRouter.patch("/deleteAccessory/:accessoryId", deleteAccessory);

module.exports = AccessoriesRouter;
