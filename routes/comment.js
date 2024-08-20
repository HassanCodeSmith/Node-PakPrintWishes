const commentRouter = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const { upload } = require("../utils/upload");

const {
  addComment,
  getComments,
  getAllCommentsRecord,
  getCommentsByUserandProduct,
  replyComment,
  deleteCommentById,
  deleteComments,
  deleteMultipleComments,
} = require("../controllers/comment");
const adminAuth = require("../middlewares/Adminauth");

commentRouter.post("/addComment", userAuth, upload.none(), addComment);
commentRouter.get("/getComments/:productId", userAuth, getComments);
commentRouter.get(
  "/getAllCommentsRecord",
  userAuth,
  adminAuth,
  getAllCommentsRecord
);
commentRouter.post(
  "/getCommentsByUserandProduct",
  userAuth,
  adminAuth,
  upload.none(),
  getCommentsByUserandProduct
);
commentRouter.post(
  "/replyComment",
  userAuth,
  adminAuth,
  upload.none(),
  replyComment
);
commentRouter.post(
  "/deleteCommentById",
  userAuth,
  adminAuth,
  upload.none(),
  deleteCommentById
);
commentRouter.post(
  "/deleteComments",
  userAuth,
  adminAuth,
  upload.none(),
  deleteComments
);

module.exports = commentRouter;
