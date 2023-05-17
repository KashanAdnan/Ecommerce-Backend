const express = require("express");
const ProductControler = require("../Controllers/Product.Controller.js");
const {
  isAuthenticateUser,
  authorizeRole,
} = require("../Middleware/Authentication.js");
const ProductRoute = express.Router();

ProductRoute.get("/products", ProductControler.getAllProducts);

ProductRoute.get(
  "/admin/products",
  isAuthenticateUser,
  authorizeRole("admin"),
  ProductControler.getAdminProducts
);
ProductRoute.post(
  "/admin/products/new",
  isAuthenticateUser,
  authorizeRole("admin"),
  ProductControler.CreateProduct
);
ProductRoute.put(
  "/admin/product/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  ProductControler.UpdateProduct
);
ProductRoute.delete(
  "/admin/product/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  ProductControler.deleteProduct
);
ProductRoute.put("/review", isAuthenticateUser, ProductControler.createRating);
ProductRoute.get("/product/:id", ProductControler.getProductDetails);
ProductRoute.get("/reviews", ProductControler.getAllReveiws);
ProductRoute.delete(
  "/reviewsDelete",
  isAuthenticateUser,
  ProductControler.deleteReviews
);

module.exports = ProductRoute;
