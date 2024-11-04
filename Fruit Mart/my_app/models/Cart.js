// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      count: Number,
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
