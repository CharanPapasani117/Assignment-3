// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
