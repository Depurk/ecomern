const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
// create product- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();

  const apiFeature = new Apifeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  res.status(200).json({ success: true, products, productCount });
});
//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }
  res.status(200).json({ success: true, product });
});
// //update products- admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: true, message: "product not found" });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, product });
});

//delete products- admin

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "product not found" });
  }
  await Product.remove();

  res
    .status(200)
    .json({ success: true, message: "product deleted successfully" });
});
