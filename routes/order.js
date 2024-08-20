const orderRouter = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const { upload } = require("../utils/upload");
const adminAuth = require("../middlewares/Adminauth");
const {
  createOrder,
  choosePaymentMethod,
  getOderDetails,
  getOrderHistory,
  getAllOrders,
  softDelete,
  MultipleSoftDelete,
  getAllSoftDeletedOrder,
  permanentDelete,
  permanentMultipleDelete,
  restoreSoftDeleted,
  changeStatus,
  getDeliveredOrders,
  getCompletedOrders,
  getCancelledOrders,
  getPendingOrders,
  getConfirmedOrders,
  softDeleteByUser,
  allSoftDeleteByUser,
  changeStatusByUser,
  getOrderDetailsByOrderCode,
} = require("../controllers/order");

orderRouter.post("/createOrder", userAuth, upload.none(), createOrder);
orderRouter.get(
  "/getOrderDetailsByOrderCode/:orderCode",
  userAuth,
  getOrderDetailsByOrderCode
);
orderRouter.get("/getOderDetails/:orderId", userAuth, getOderDetails);
orderRouter.get("/getOrderHistory", userAuth, getOrderHistory);
orderRouter.post(
  "/choosePaymentMethod",
  userAuth,
  upload.none(),
  choosePaymentMethod
);

// Admin routes
orderRouter.get("/getAllOrders", userAuth, adminAuth, getAllOrders);
orderRouter.get("/getDeliveredOrders", userAuth, adminAuth, getDeliveredOrders);
orderRouter.get("/getPendingOrders", userAuth, adminAuth, getPendingOrders);
orderRouter.get("/getCompletedOrders", userAuth, adminAuth, getCompletedOrders);
orderRouter.get("/getCancelledOrders", userAuth, adminAuth, getCancelledOrders);
orderRouter.get("/getConfirmedOrders", userAuth, adminAuth, getConfirmedOrders);
orderRouter.patch(
  "/changeStatus/:orderId",
  userAuth,
  adminAuth,
  upload.none(),
  changeStatus
);
orderRouter.patch(
  "/changeStatusByUser/:orderId",
  userAuth,
  upload.none(),
  changeStatusByUser
);
orderRouter.get(
  "/getAllSoftDeletedOrder",
  userAuth,
  adminAuth,
  getAllSoftDeletedOrder
);
orderRouter.post(
  "/MultipleSoftDelete",
  userAuth,
  adminAuth,
  upload.none(),
  MultipleSoftDelete
);
orderRouter.post(
  "/permanentMultipleDelete",
  userAuth,
  adminAuth,
  upload.none(),
  permanentMultipleDelete
);
orderRouter.delete("/softDelete/:orderId", userAuth, adminAuth, softDelete);
orderRouter.delete("/softDeleteByUser/:orderId", userAuth, softDeleteByUser);
orderRouter.delete("/allSoftDeleteByUser", userAuth, allSoftDeleteByUser);
orderRouter.patch(
  "/restoreSoftDeleted/:orderId",
  userAuth,
  adminAuth,
  restoreSoftDeleted
);
orderRouter.delete(
  "/permanentDeleteOrder/:orderId",
  userAuth,
  adminAuth,
  permanentDelete
);

module.exports = orderRouter;
