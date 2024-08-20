const vendorOrderRouter = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const { upload } = require("../utils/upload");
const adminAuth = require("../middlewares/Adminauth");

const {
  assignCompeleteOrder,
  assignOrderedProduct,
  getAllVendorOrders,
  changeStatus,
  getVendorOrderbyId,
  deliveryOrderStatus,
} = require("../controllers/vendorOrder");

vendorOrderRouter.get(
  "/getAllVendorOrders",
  userAuth,
  adminAuth,
  getAllVendorOrders
);
vendorOrderRouter.get(
  "/getVendorOrderbyId/:id",
  userAuth,
  adminAuth,
  getVendorOrderbyId
);

vendorOrderRouter.get(
  "/getAllVendorOrdersPending",
  userAuth,
  adminAuth,
  getAllVendorOrders
);

vendorOrderRouter.get(
  "/getAllVendorOrdersConfirm",
  userAuth,
  adminAuth,
  getAllVendorOrders
);

vendorOrderRouter.get(
  "/getAllVendorOrdersCancelled",
  userAuth,
  adminAuth,
  getAllVendorOrders
);

vendorOrderRouter.get(
  "/getAllVendorOrdersCompleted",
  userAuth,
  adminAuth,
  getAllVendorOrders
);
vendorOrderRouter.get(
  "/getAllVendorOrdersDeliverd",
  userAuth,
  adminAuth,
  getAllVendorOrders
);

vendorOrderRouter.post(
  "/assignCompeleteOrder",
  userAuth,
  adminAuth,
  upload.none(),
  assignCompeleteOrder
);

vendorOrderRouter.post(
  "/assignOrderedProduct",
  userAuth,
  adminAuth,
  upload.none(),
  assignOrderedProduct
);

vendorOrderRouter.patch(
  "/changevendorOrderStatus/:id",
  userAuth,
  adminAuth,
  upload.none(),
  changeStatus
);
vendorOrderRouter.patch(
  "/deliveryOrderStatus/:vendorOrderId",
  userAuth,
  adminAuth,
  upload.none(),
  deliveryOrderStatus
);

module.exports = vendorOrderRouter;
