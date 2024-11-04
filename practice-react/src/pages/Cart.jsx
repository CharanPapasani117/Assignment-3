// components/Cart.jsx
import { ItemsContext } from './ItemsContext';

import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import './Products.css';
import Modal from './Modal';

export default function Cart() {
  const { cart, setCart } = useContext(ItemsContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    fetchCart();
  }, []);
  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };
  // Fetch cart items and calculate total price on load
  const fetchCart = async () => {
    try {
      const response = await axios.get('http://18.218.247.69:3000/api/cart');
      setCart(response.data.items);
      calculateTotalPrice(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Calculate total price
  const calculateTotalPrice = (cartItems) => {
    const total = cartItems.reduce((acc, item) => {
      return acc + item.productId.price * item.count;
    }, 0);
    setTotalPrice(total);
  };

  // Increase quantity
  const increaseQuantity = async (productId, currentCount) => {
    const newCount = currentCount + 1;
    await updateQuantity(productId, newCount);
  };

  // Decrease quantity
  const decreaseQuantity = async (productId, currentCount) => {
    const newCount = currentCount > 1 ? currentCount - 1 : 1;
    await updateQuantity(productId, newCount);
  };

  // Update item quantity
  const updateQuantity = async (productId, count) => {
    try {
      if (count <= 0) {
        // Remove item from the cart if count is zero
        await axios.delete(`http://18.218.247.69:3000/api/cart/${productId}`);
        const updatedCart = cart.filter(item => item.productId._id !== productId);
        setCart(updatedCart);
        calculateTotalPrice(updatedCart); // Recalculate total price if needed
      } else {
        // Update the quantity if count is greater than zero
        await axios.put('http://18.218.247.69:3000/api/cart', { productId, count });
        const updatedCart = cart.map(item =>
          item.productId._id === productId ? { ...item, count } : item
        );
        setCart(updatedCart);
        calculateTotalPrice(updatedCart); // Recalculate total price if needed
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://18.218.247.69:3000/api/cart/${productId}`);
      const updatedCart = cart.filter(item => item.productId._id !== productId);
      setCart(updatedCart);
      calculateTotalPrice(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="total-price">Total Price: ${totalPrice.toFixed(2)}</h2>
      <h1>Your Cart</h1>
      {cart
        .filter(item => item.count > 0) // Only display items with count greater than zero
        .map(item => (
          <div key={item.productId._id} className="cart-item">
            <img
  src={item.productId.image}
  alt={item.productId.name}
  style={{
    width: '150px',         // Set desired width
    height: '150px',        // Set desired height
    objectFit: 'cover',     // Ensures image fills the area without distortion
    borderRadius: '8px'     // Optional: for rounded corners
  }}
/><h3 onClick={() => openModal(item.productId)} className="product-name link">{item.productId.name}</h3>
            <p>Price per unit: ${item.productId.price}</p>
            <p>Total price for item: ${(item.productId.price * item.count).toFixed(2)}</p>
            <div className="button-container">
              <button onClick={() => updateQuantity(item.productId._id, item.count - 1)}>-</button>
              <span>{item.count}</span>
              <button onClick={() => updateQuantity(item.productId._id, item.count + 1)}>+</button>
            </div>
          </div>
        ))}
      <Modal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
    </div>
  );
  
}
