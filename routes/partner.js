const partnerRouter = require("express").Router();
const { upload } = require("../utils/upload");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const {
  addPartner,
  getAllPartner,
  deletePartner,
  deleteMultiplePartners,
  updatePartners,
} = require("../controllers/partner");

partnerRouter.post(
  "/addPartner",
  authMiddleware,
  adminAuth,
  upload.single("logo"),
  addPartner
);
partnerRouter.patch(
  "/updatePartners/:partnerId",
  authMiddleware,
  adminAuth,
  upload.single("logo"),
  updatePartners
);
partnerRouter.post(
  "/deleteMultiplePartners",
  authMiddleware,
  adminAuth,
  upload.none(),
  deleteMultiplePartners
);
partnerRouter.get("/getAllPartner", authMiddleware, adminAuth, getAllPartner);
partnerRouter.get("/user/getAllPartner", getAllPartner);
partnerRouter.delete(
  "/deletePartner/:partnerId",
  authMiddleware,
  adminAuth,
  deletePartner
);

module.exports = partnerRouter;
