import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user
  const userId = user?._id;
  const storageKey = userId ? `cart_${userId}` : "guest_cart"; // Unique key per user or guest

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Update cart on user change (e.g., login/logout)
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = (product) => {
    const formattedImage = product.image?.includes("http")
      ? product.image
      : `https://manglore-store-t98r.onrender.com/${product.image.replace(/\\/g, "/")}`;

    const exists = cartItems.find((item) => item._id === product._id);

    if (exists) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.info('Quantity updated in cart', { toastId: `update-${product._id}` });
    } else {
      setCartItems((prev) => [
        ...prev,
        { ...product, image: formattedImage, quantity: 1 },
      ]);
      toast.success('Added to cart', { toastId: `add-${product._id}` });
    }
  };

  const changeQuantity = (id, newQty) => {
    if (newQty < 1) {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      toast.warn('Removed from cart', { toastId: `remove-${id}` });
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: newQty } : item
        )
      );
      toast.info('Cart quantity changed', { toastId: `change-${id}` });
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast.warn('Removed from cart', { toastId: `remove-${id}` });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.error('Cart cleared', { toastId: 'clear-cart' });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
