const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../Controllers/Payment.Controller");
const PaymentRoute = express.Router();
const { isAuthenticateUser } = require("../Middleware/Authentication");

PaymentRoute.post("/payment/process", isAuthenticateUser, processPayment);

PaymentRoute.get("/stripeapikey", isAuthenticateUser, sendStripeApiKey);

module.exports = PaymentRoute;
