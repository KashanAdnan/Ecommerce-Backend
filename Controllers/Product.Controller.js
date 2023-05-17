const { ProductModel } = require("../Models/Product.Model");
const ErrorHandler = require("../Utils/Error.Handler");
const catchAsyncError = require("../Middleware/catch.Async.error");
const Apifeatures = require("../Utils/Api.Features");
const cloudinary = require("cloudinary");

// Creating Product
const CreateProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.image === "string") {
    images.push(req.body.image);
  } else {
    images = req.body.image;
  }

  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
      width: 550,
      crop: "scale",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.image = imagesLinks;
  req.body.user = req.user.id;

  const product = await ProductModel.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
//Getting all products
const getAllProducts = async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await ProductModel.countDocuments();

  const apiFeatures = new Apifeatures(ProductModel.find(), req.query)
    .search()
    .filter();
  apiFeatures.pagination(resultPerPage);
  let products = await apiFeatures.query;

  let filteredProductsCount = products.length;

  res.status(200).send({
    sucess: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
};
// Updating the Products
const UpdateProduct = catchAsyncError(async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.image;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.v2.uploader.destroy(product.image[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imagesLinks;
  }

  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
//Delting the Products
const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    msg: "Product successfully Deleted",
  });
});
//Getting Signle Product Details
const getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).send({
    success: true,
    product,
  });
});
const createRating = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await ProductModel.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) rev.rating = rating;
      rev.comment = comment;
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await ProductModel.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// get All reviews
const getAllReveiws = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
const deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = (product.ratings = avg / product.reviews.length);
  const numOfReviews = reviews.length;
  await ProductModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});

module.exports = {
  CreateProduct,
  getAllProducts,
  UpdateProduct,
  deleteProduct,
  getProductDetails,
  createRating,
  getAllReveiws,
  getAdminProducts,
  deleteReviews,
};
