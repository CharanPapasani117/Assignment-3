import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

export default function Layout() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <FontAwesomeIcon icon={faAppleAlt} className="logo-icon" />
          <h2>Fruit Mart</h2>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon={faAppleAlt} className="nav-icon" />
            Products
          </Link>
          <Link to="/cart" className="nav-link">
            <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
            Cart
          </Link>
          <Link to="/wishlist" className="nav-link">
            <FontAwesomeIcon icon={faHeart} className="nav-icon" />
            Wishlist
          </Link>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
