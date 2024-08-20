const paymentRouter = require("express").Router();
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

const {
  payment,
  getApprovedOrders,
  getPaymentHistory,
} = require("../controllers/payment");

paymentRouter.post(
  "/createPayment/:vendorId",
  authMiddleware,
  adminAuth,
  upload.none(),
  payment
);
paymentRouter.get(
  "/getApprovedOrders/:vendorId",
  authMiddleware,
  adminAuth,
  getApprovedOrders
);
paymentRouter.get("/getPaymentHistory", authMiddleware, getPaymentHistory);

module.exports = paymentRouter;
