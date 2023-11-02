const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});

  ctx.body = {
    products: products.map(mapProduct),
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = {
    products: products.map(mapProduct),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.throw(400, 'invalid product id');
  }

  const product = await Product.findById(productId);

  if (!product) ctx.throw(404, 'product not found');

  ctx.body = {
    product: mapProduct(product),
  };
};

