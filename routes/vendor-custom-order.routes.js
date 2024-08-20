const vendorCustomOrderRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

const {
  getAllVendorCustomOrders,
  getAllPendingVendorCustomOrders,
  getAllConfirmVendorCustomOrders,
  getAllCompletedVendorCustomOrders,
  getAllCancelledVendorCustomOrders,
  getAllDeliveredVendorCustomOrders,
  changeStatusVendorCustomOrderById,
  getVendorCustomOrderById,
} = require("../controllers/vendor-custom-order.controllers");

vendorCustomOrderRouter.get(
  "/getAllVendorCustomOrders",
  userAuth,
  adminAuth,
  getAllVendorCustomOrders
);

vendorCustomOrderRouter.get(
  "/getAllPendingVendorCustomOrders",
  userAuth,
  adminAuth,
  getAllPendingVendorCustomOrders
);

vendorCustomOrderRouter.get(
  "/getAllConfirmVendorCustomOrders",
  userAuth,
  adminAuth,
  getAllConfirmVendorCustomOrders
);

vendorCustomOrderRouter.get(
  "/getAllCompletedVendorCustomOrders",
  userAuth,
  adminAuth,
  getAllCompletedVendorCustomOrders
);

vendorCustomOrderRouter.get(
  "/getAllCancelledVendorCustomOrders",
  userAuth,
  adminAuth,
  getAllCancelledVendorCustomOrders
);

vendorCustomOrderRouter.get(
  "/getAllDeliveredVendorCustomOrders",
  userAuth,
  adminAuth,
  getAllDeliveredVendorCustomOrders
);

vendorCustomOrderRouter.patch(
  "/changeStatusVendorCustomOrderById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  changeStatusVendorCustomOrderById
);

vendorCustomOrderRouter.get(
  "/getVendorCustomOrderById/:id",
  userAuth,
  adminAuth,
  getVendorCustomOrderById
);

module.exports = vendorCustomOrderRouter;
