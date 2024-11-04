// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.put('/', cartController.updateCart);
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;
