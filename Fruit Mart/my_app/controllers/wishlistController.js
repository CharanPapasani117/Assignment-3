// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');

const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne().populate('items');
    if (!wishlist) {
      return res.json({ items: [] });
    }
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne();
    if (!wishlist) {
      wishlist = new Wishlist();
    }

    if (wishlist.items.includes(productId)) {
      wishlist.items = wishlist.items.filter(id => !id.equals(productId));
    } else {
      wishlist.items.push(productId);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await Wishlist.findOne();
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => !item.equals(productId));
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
};
