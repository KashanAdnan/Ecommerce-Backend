const Order = require("../Models/Order.Model");
const { ProductModel } = require("../Models/Product.Model");
const ErrorHandler = require("../Utils/Error.Handler");
const catchAsyncError = require("../Middleware/catch.Async.error");

const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    OrderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    OrderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    succes: true,
    order,
  });
});

const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order Not Found With this ID", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

const myOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmout = 0;
  orders.forEach((order) => {
    totalAmout + order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmout,
    orders,
  });
});

async function updateStock(quantity, id) {
  const product = await ProductModel.findById(id);
  product.Stock = product.Stock - quantity;
  await product.save({ validateBeforeSave: false });
}
const UpdateOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found With this ID", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You Have Already Delivered this Product", 400)
    );
  }
  if (req.body.status === "Shipped") {
    order.OrderItems.forEach(async (order) => {
      await updateStock(order.quantity, order.product);
    });
  }

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliverAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found With this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  newOrder,
  myOrder,
  getSingleOrder,
  getAllOrders,
  UpdateOrders,
  deleteOrder,
};
