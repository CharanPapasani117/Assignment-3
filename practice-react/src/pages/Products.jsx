import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { ItemsContext } from './ItemsContext';
import './Products.css';
import Modal from './Modal';

export default function Products() {
  const { items, setItems, wishlist, setWishlist, cart, setCart } = useContext(ItemsContext);
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchWishlist();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/cart');
      setCart(response.data.items);
      calculateSelectedTotalPrice(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/wishlist');
      setWishlist(response.data.items.map(item => item._id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const calculateSelectedTotalPrice = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + item.productId.price * item.count, 0);
    setSelectedTotalPrice(total);
  };

  const addToCart = async (product) => {
    const existingItem = cart.find(item => item.productId._id === product._id);

    try {
      if (existingItem) {
        await updateQuantity(product._id, existingItem.count + 1);
      } else {
        await axios.put('http://localhost:3000/api/cart', { productId: product._id, count: 1 });
        const updatedCart = [...cart, { productId: product, count: 1 }];
        setCart(updatedCart);
        calculateSelectedTotalPrice(updatedCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (productId, count) => {
    try {
      if (count <= 0) {
        await axios.delete(`http://localhost:3000/api/cart/${productId}`);
        const updatedCart = cart.filter(item => item.productId._id !== productId);
        setCart(updatedCart);
        calculateSelectedTotalPrice(updatedCart);
      } else {
        await axios.put('http://localhost:3000/api/cart', { productId, count });
        const updatedCart = cart.map(item =>
          item.productId._id === productId ? { ...item, count } : item
        );
        setCart(updatedCart);
        calculateSelectedTotalPrice(updatedCart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const toggleWishlist = async (product) => {
    try {
      if (wishlist.includes(product._id)) {
        await axios.delete(`http://localhost:3000/api/wishlist/${product._id}`);
        setWishlist(wishlist.filter(id => id !== product._id));
      } else {
        await axios.post('http://localhost:3000/api/wishlist', { productId: product._id });
        setWishlist([...wishlist, product._id]);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="product-list">
        {items.map(item => {
          const isInCart = cart.find(cartItem => cartItem.productId._id === item._id);
          const isInWishlist = wishlist.includes(item._id);

          return (
            <div key={item._id} className="product-card">
              <FontAwesomeIcon
                icon={faHeart}
                className={`wishlist-icon ${isInWishlist ? 'active' : ''}`}
                onClick={() => toggleWishlist(item)}
              />
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '150px',         // Set desired width
                  height: '150px',        // Set desired height
                  objectFit: 'cover',     // Ensures image fills the area without distortion
                  borderRadius: '8px'     // Optional: for rounded corners
                }}
              />
              <h3 onClick={() => openModal(item)} className="product-name link">{item.name}</h3>
              <p>Price per unit: ${item.price}</p>

              {isInCart && isInCart.count > 0 ? (
                <div className="button-container">
                  <p className="item-total-price">Total for item: ${(item.price * isInCart.count).toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item._id, isInCart.count - 1)}>-</button>
                    <span>{isInCart.count}</span>
                    <button onClick={() => updateQuantity(item._id, isInCart.count + 1)}>+</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              )}
            </div>
          );
        })}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
    </div>
  );
}
