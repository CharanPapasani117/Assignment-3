// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ItemsProvider } from './pages/ItemsContext';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Wishlist from './pages/WishList';
import Layout from './pages/Layout';

function App() {
  return (
    <ItemsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Products />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </Router>
    </ItemsProvider>
  );
}

export default App;