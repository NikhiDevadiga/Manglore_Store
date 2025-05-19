import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast"; 

const Wishlist = createContext();
export const useWishlist = () => useContext(Wishlist);

export const WishlistProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));//Retrieves the logged-in user object from localStorage & Parses it from string to object
  const userId = user?._id; // Extracts the user's MongoDB _id using optional chaining (?.) & This ID is used to create a unique wishlist for each user

  const storageKey = userId ? `wishlist_${userId}` : null; // Use the user's _id in the storage key

  const [wishlist, setWishlist] = useState(() => {
    if (storageKey) {
      // Retrieve the wishlist for the specific user if a valid user exists
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : []; // If no data, return an empty array
    }
    return []; // Return empty wishlist if no user is logged in
  });

  useEffect(() => {
    if (userId && storageKey) {
      // If there's a valid user, fetch the wishlist for that user
      const storedWishlist = localStorage.getItem(storageKey);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist)); // Set wishlist for the logged-in user
      } else {
        setWishlist([]); // If no wishlist found, set to empty array
      }
    } else {
      setWishlist([]); // Clear wishlist if no user is logged in
    }
  }, [userId, storageKey]); // Re-run when user changes

  // Save the wishlist to localStorage whenever it changes
  useEffect(() => {
    if (storageKey && wishlist.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(wishlist)); // Save to the user-specific key
    }
  }, [wishlist, storageKey]);

  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((item) => item._id === product._id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
    toast.success("Product removed from wishlist")
  };

  return (
    <Wishlist.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </Wishlist.Provider>
  );
};
