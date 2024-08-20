const favtProductRouter = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const { upload } = require("../utils/upload");
const {
  addToProduct,
  getFavoriteProduct,
  getAllFavtProducts,
} = require("../controllers/favt_product");

favtProductRouter.get(
  "/getFavoriteProduct/:productId",
  userAuth,
  getFavoriteProduct
);
favtProductRouter.get("/getAllFavtProducts", userAuth, getAllFavtProducts);
favtProductRouter.post("/addToProduct", userAuth, upload.none(), addToProduct);

module.exports = favtProductRouter;
