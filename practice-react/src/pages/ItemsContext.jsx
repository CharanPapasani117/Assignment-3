import React, { createContext, useState } from 'react';

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  return (
    <ItemsContext.Provider value={{ items, setItems, wishlist, setWishlist, cart, setCart }}>
      {children}
    </ItemsContext.Provider>
  );
};
