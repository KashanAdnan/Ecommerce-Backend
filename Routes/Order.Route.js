const express = require("express");
const OrderController = require("../Controllers/Order.Controller");
const OrderRoute = express.Router();
const {
  isAuthenticateUser,
  authorizeRole,
} = require("../Middleware/Authentication.js");
OrderRoute.post("/order/new", isAuthenticateUser, OrderController.newOrder);
OrderRoute.get(
  "/order/:id",
  isAuthenticateUser,
  OrderController.getSingleOrder
);
OrderRoute.get("/orders/me", isAuthenticateUser, OrderController.myOrder);
OrderRoute.get(
  "/admin/orders",
  isAuthenticateUser,
  authorizeRole("admin"),
  OrderController.getAllOrders
);
OrderRoute.put(
  "/admin/order/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  OrderController.UpdateOrders
);
OrderRoute.delete(
  "/admin/order/:id",
  isAuthenticateUser,
  authorizeRole("admin"),
  OrderController.deleteOrder
);

module.exports = OrderRoute;
