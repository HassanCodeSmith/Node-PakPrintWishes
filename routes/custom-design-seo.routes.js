const {
  createCustomDesignSeo,
  getCustomDesignSeoById,
  getAllCustomDesignSeos,
  updateCustomDesignSeoById,
  deleteCustomDesignSeoById,
} = require("../controllers/custom-design-seo.controllers");
const customDesignSeoRouter = require("express").Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/Adminauth");
const { upload } = require("../utils/upload");

// create custom design seo
customDesignSeoRouter.post(
  "/createCustomDesignSeo",
  userAuth,
  adminAuth,
  upload.none(),
  createCustomDesignSeo
);

// get all custom design seos
customDesignSeoRouter.get(
  "/getAllCustomDesignSeos",
  userAuth,
  adminAuth,
  upload.none(),
  getAllCustomDesignSeos
);

// get custom design seo by id
customDesignSeoRouter.get(
  "/getCustomDesignSeoById/:id",
  upload.none(),
  getCustomDesignSeoById
);

// update custom design seo by id
customDesignSeoRouter.patch(
  "/updateCustomDesignSeoById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  updateCustomDesignSeoById
);

// delete custom design seo by id
customDesignSeoRouter.patch(
  "/deleteCustomDesignSeoById/:id",
  userAuth,
  adminAuth,
  upload.none(),
  deleteCustomDesignSeoById
);

module.exports = customDesignSeoRouter;
