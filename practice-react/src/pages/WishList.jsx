import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ItemsContext } from './ItemsContext';
import './Products.css';
import Modal from './Modal';

export default function Wishlist() {
  const { wishlist, setWishlist } = useContext(ItemsContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
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

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://18.218.247.69:3000/api/wishlist');
      setWishlist(response.data.items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://18.218.247.69:3000/api/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <div className="container">
      <h1>Your Wishlist</h1>
      {wishlist.map(item => (
        <div key={item._id} className="wishlist-item">
          <img src={item.image} alt={item.name} className="product-image" />
          <h3 onClick={() => openModal(item)} className="product-name link">{item.name}</h3>
          <p>Price: ${item.price}</p>
          <button
            onClick={() => removeFromWishlist(item._id)}
            className="remove-button"
          >
            Remove
          </button>
        </div>
      ))}
      <Modal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
    </div>
  );
}
