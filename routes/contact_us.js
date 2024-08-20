const contactRouter = require("express").Router();
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");
const {
  addMessage,
  getAllMessages,
  deleteMessage,
  deleteMessageMultiple,
} = require("../controllers/contact_us");

contactRouter.post("/addMessage", upload.none(), addMessage);
contactRouter.post(
  "/deleteMessageMultiple",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMessageMultiple
);
contactRouter.get("/getAllMessages", authMiddleware, adminAuth, getAllMessages);
contactRouter.delete(
  "/deleteMessage/:id",
  authMiddleware,
  adminAuth,
  deleteMessage
);

module.exports = contactRouter;
