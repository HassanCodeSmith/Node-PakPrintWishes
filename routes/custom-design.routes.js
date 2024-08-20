const customDesignRouter = require("express").Router();
const {
  createCustomDesign,
  authApiGetAllCustomDesigns,
  publicApiGetAllCustomDesigns,
  publicApiGetCustomDesignsByCustomParentId,
  publicApiGetCustomDesignsByCustomChildId,
  publicApiGetCustomDesignsByProductId,
  changeCustomDesignStatus,
  deleteCustomDesign,
  updateCustomDesign,
  uploadCustomDesignFile,
  authApiGetCustomDesignById,
} = require("../controllers/custom-design.controllers");
const { upload } = require("../utils/upload");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");

// create custom design
customDesignRouter.post(
  "/createCustomDesign",
  userAuth,
  adminAuth,
  upload.any(),
  createCustomDesign
);

// auth api get all custom designs
customDesignRouter.get(
  "/authApiGetAllCustomDesigns",
  userAuth,
  adminAuth,
  authApiGetAllCustomDesigns
);

// auth api get all custom designs
customDesignRouter.get(
  "/authApiGetCustomDesignById/:id",
  userAuth,
  adminAuth,
  authApiGetCustomDesignById
);

// public api get all custom designs
customDesignRouter.get(
  "/publicApiGetAllCustomDesigns",
  publicApiGetAllCustomDesigns
);

// public api get custom designs by parent id
customDesignRouter.get(
  "/publicApiGetCustomDesignsByCustomParentId/:customParentCategoryId",
  publicApiGetCustomDesignsByCustomParentId
);

// public api get custom designs by child id
customDesignRouter.get(
  "/publicApiGetCustomDesignsByCustomChildId/:customChildCategoryId",
  publicApiGetCustomDesignsByCustomChildId
);

// public api get custom designs by child id
customDesignRouter.get(
  "/publicApiGetCustomDesignsByProductId/:productId",
  publicApiGetCustomDesignsByProductId
);

// api to change custom design status
customDesignRouter.patch(
  "/changeCustomDesignStatus/:customDesignId",
  userAuth,
  adminAuth,
  changeCustomDesignStatus
);

// api to delete custom design
customDesignRouter.patch(
  "/deleteCustomDesign/:customDesignId",
  userAuth,
  adminAuth,
  deleteCustomDesign
);

// api to update custom design
customDesignRouter.patch(
  "/updateCustomDesign/:customDesignId",
  userAuth,
  adminAuth,
  upload.any(),
  updateCustomDesign
);

// api for add custom design file
customDesignRouter.post(
  "/uploadCustomDesignFile",
  userAuth,
  upload.single("file"),
  uploadCustomDesignFile
);
module.exports = customDesignRouter;
