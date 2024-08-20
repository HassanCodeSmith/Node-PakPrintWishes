const notificationRouter = require("express").Router();

const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  getNotification,
  markAllAsRead,
  markOneAsRead,
} = require("../controllers/notification");

notificationRouter.get(
  "/getNotification",
  authMiddleware,
  adminAuth,
  getNotification
);

notificationRouter.post(
  "/markAllAsRead",
  authMiddleware,
  adminAuth,
  markAllAsRead
);

notificationRouter.post(
  "/markOneAsRead/:notificationId",
  authMiddleware,
  adminAuth,
  markOneAsRead
);

module.exports = notificationRouter;
