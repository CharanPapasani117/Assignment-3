import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.name} className="modal-image" />
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default Modal;
