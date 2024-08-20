const {
  getCustomCategoriesNavigationBar,
} = require("../controllers/custom-categories-navigation-bar.controllers");

const customCategoriesNavigationBarRouter = require("express").Router();

customCategoriesNavigationBarRouter.get(
  "/getCustomCategoriesNavigationBar",
  getCustomCategoriesNavigationBar
);

module.exports = customCategoriesNavigationBarRouter;
