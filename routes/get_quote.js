const express = require("express");
const GetQuoteRouter = express.Router();

const { uploadFile, upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  getQuote,
  addGetQuote,
  updateStatus,
  getQuotePending,
  getQuoteConfirm,
  getQuoteDeliver,
  softDeleteQuote,
  softDeleteQuoteMultiple,
  getAllSoftDeleted,
  permenantDelete,
  restoreQuote,
  permanantDeleteQuoteMultiple,
  addRateToQuote,
  getQuoteById,
} = require("../controllers/get_quote");

GetQuoteRouter.post("/addGetQuote", upload.single("file"), addGetQuote);
GetQuoteRouter.get("/getQuote", authMiddleware, adminAuth, getQuote);
GetQuoteRouter.get("/getQuote/:id", authMiddleware, adminAuth, getQuoteById);
GetQuoteRouter.get(
  "/getAllSoftDeleted",
  authMiddleware,
  adminAuth,
  getAllSoftDeleted
);
GetQuoteRouter.delete(
  "/softDeleteQuote/:quoteId",
  authMiddleware,
  adminAuth,
  softDeleteQuote
);
GetQuoteRouter.patch(
  "/restoreQuote/:quoteId",
  authMiddleware,
  adminAuth,
  restoreQuote
);
GetQuoteRouter.delete(
  "/permenantDelete/:quoteId",
  authMiddleware,
  adminAuth,
  permenantDelete
);
GetQuoteRouter.post(
  "/softDeleteQuoteMultiple",
  authMiddleware,
  adminAuth,
  upload.none(),
  softDeleteQuoteMultiple
);
GetQuoteRouter.post(
  "/addRateToQuote",
  authMiddleware,
  adminAuth,
  upload.none(),
  addRateToQuote
);
GetQuoteRouter.post(
  "/permanantDeleteQuoteMultiple",
  authMiddleware,
  adminAuth,
  upload.none(),
  permanantDeleteQuoteMultiple
);
GetQuoteRouter.get(
  "/getQuotePending",
  authMiddleware,
  adminAuth,
  getQuotePending
);
GetQuoteRouter.get(
  "/getQuoteConfirm",
  authMiddleware,
  adminAuth,
  getQuoteConfirm
);
GetQuoteRouter.get(
  "/getQuoteDeliver",
  authMiddleware,
  adminAuth,
  getQuoteDeliver
);
GetQuoteRouter.patch(
  "/updateStatus",
  authMiddleware,
  adminAuth,
  upload.none(),
  updateStatus
);

module.exports = GetQuoteRouter;
