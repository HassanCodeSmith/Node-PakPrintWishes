const customProductOrderRouter = require("express").Router();
const {
  getAllCustomProductOrders,
  getCustomProductOrderById,
  getAllDeletedCustomProductOrders,
  getAllPendingCustomProductOrders,
  getAllConfirmCustomProductOrders,
  getAllDeliverCustomProductOrders,
  getAllCompletedCustomProductOrders,
  getAllCancelledCustomProductOrders,
  softDeleteCustomProductOrder,
  restoreSoftDeleteCustomProductOrder,
  deletePermanentlyCustomProductOrder,
  changeCustomProductOrderStatus,
  assignCompleteCustomProductOrderToAsingleVendor,
  assignSingleCustomProductOrderToAsingleVendor,
  getCustomProductFromCustomProductOrderById,
} = require("../controllers/order-custom-product.controllers");

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

/** get all custom product orders */
customProductOrderRouter.get(
  "/getAllCustomProductOrders",
  userAuth,
  adminAuth,
  getAllCustomProductOrders
);

/** get custom product order using id */
customProductOrderRouter.get(
  "/getCustomProductOrderById/:id",
  userAuth,
  adminAuth,
  getCustomProductOrderById
);

/** soft delete custom product order using id */
customProductOrderRouter.patch(
  "/softDeleteCustomProductOrder/:id",
  userAuth,
  adminAuth,
  softDeleteCustomProductOrder
);

/** restore soft delete custom product order using id */
customProductOrderRouter.patch(
  "/restoreSoftDeleteCustomProductOrder/:id",
  userAuth,
  adminAuth,
  restoreSoftDeleteCustomProductOrder
);

/** delete custom product order using id */
customProductOrderRouter.patch(
  "/deletePermanentlyCustomProductOrder/:id",
  userAuth,
  adminAuth,
  deletePermanentlyCustomProductOrder
);

/** get all deleted custom product orders */
customProductOrderRouter.get(
  "/getAllDeletedCustomProductOrders",
  userAuth,
  adminAuth,
  getAllDeletedCustomProductOrders
);

/** get all pending custom product orders */
customProductOrderRouter.get(
  "/getAllPendingCustomProductOrders",
  userAuth,
  adminAuth,
  getAllPendingCustomProductOrders
);

/** get all confirm custom product orders */
customProductOrderRouter.get(
  "/getAllConfirmCustomProductOrders",
  userAuth,
  adminAuth,
  getAllConfirmCustomProductOrders
);

/** get all deliver custom product orders */
customProductOrderRouter.get(
  "/getAllDeliverCustomProductOrders",
  userAuth,
  adminAuth,
  getAllDeliverCustomProductOrders
);

/** get all deleted custom product orders */
customProductOrderRouter.get(
  "/getAllCompletedCustomProductOrders",
  userAuth,
  adminAuth,
  getAllCompletedCustomProductOrders
);

/** get all cancelled custom product orders */
customProductOrderRouter.get(
  "/getAllCancelledCustomProductOrders",
  userAuth,
  adminAuth,
  getAllCancelledCustomProductOrders
);

/** update status custom product order using id */
customProductOrderRouter.patch(
  "/changeCustomProductOrderStatus/:id",
  userAuth,
  adminAuth,
  upload.none(),
  changeCustomProductOrderStatus
);

/** Assign Comple Custom Product Order To A Single Vender*/
customProductOrderRouter.patch(
  "/assignCompleteCustomProductOrderToAsingleVendor",
  userAuth,
  adminAuth,
  upload.none(),
  assignCompleteCustomProductOrderToAsingleVendor
);

/** Assign Comple Custom Product Order To A Single Vender*/
customProductOrderRouter.patch(
  "/assignSingleCustomProductOrderToAsingleVendor",
  userAuth,
  adminAuth,
  upload.none(),
  assignSingleCustomProductOrderToAsingleVendor
);
module.exports = customProductOrderRouter;
