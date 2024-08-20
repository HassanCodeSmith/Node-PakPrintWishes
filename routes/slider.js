const sliderRoutes = require("express").Router();
const {
  addSlider,
  getSlider,
  deleteSlider,
  multipleDeleteSliders,
  updateSlider,
} = require("../controllers/slider");
const authMiddleware = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

const { upload } = require("../utils/upload");

sliderRoutes.post(
  "/addSlider",
  authMiddleware,
  adminAuth,
  upload.single("sliderImage"),
  addSlider
);

sliderRoutes.get("/getSlider", getSlider);

sliderRoutes.delete(
  "/deleteSlider/:sliderId",
  authMiddleware,
  adminAuth,
  deleteSlider
);

sliderRoutes.post(
  "/multipleDeleteSliders",
  authMiddleware,
  adminAuth,
  upload.none(),
  multipleDeleteSliders
);

sliderRoutes.patch(
  "/updateSlider/:sliderId",
  authMiddleware,
  adminAuth,
  upload.single("sliderImage"),
  updateSlider
);

module.exports = sliderRoutes;
