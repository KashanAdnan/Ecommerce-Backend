const catchAsyncErrors = require("../Middleware/catch.Async.error");

const stripe = require("stripe")(
  "sk_test_51N4r2ZAnGUbycV6lSRA0I3MupNOb5LUMDZoRig8wDlUCkXpNDETbpYgBqp7Cnf0OH6ckeqeWNTPMHqRj0AsDbYa3007wXYdHvh"
);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "pkr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .json({
      stripeApiKey:
        "pk_test_51N4r2ZAnGUbycV6lUpB7JTRF9zOEcyy4DSUfJ47ogXdbv29eDwEcSvQt2HOZZc056MigftUAbNewEN2X0Wn5jJ2k00EkCME04b",
    });
});