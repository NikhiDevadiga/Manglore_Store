import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const storageKey = userId ? `cart_${userId}` : "guest_cart";

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // useEffect(() => {
  //   const stored = localStorage.getItem(storageKey);
  //   setCartItems(stored ? JSON.parse(stored) : []);
  // }, [storageKey]);

  // useEffect(() => {
  //   localStorage.setItem(storageKey, JSON.stringify(cartItems));
  // }, [cartItems, storageKey]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setCartItems(JSON.parse(stored));
    } else {
      setCartItems([]);
    }
  }, [userId]); // ← this should depend only on userId, not storageKey

  // --- Unit conversion helpers ---
  const unitToBase = {
    Kg: 1000,
    Gm: 1,
    mg: 0.001,
    Liter: 1000,
    Ml: 1,
  };

  const convertToBaseUnit = (quantity, unit) => {
    return unitToBase[unit] ? quantity * unitToBase[unit] : quantity;
  };

  const isOfferValidTodayOrFuture = (validTill) => {
    if (!validTill) return false;
    const today = new Date();
    const expiry = new Date(validTill);

    // Compare date only, ignore time
    return expiry >= new Date(today.toDateString());
  };

  const calculateOfferPrice = (product) => {
    const { price, offer } = product;

    if (
      offer &&
      offer.offerpercentage > 0 &&
      isOfferValidTodayOrFuture(offer.validTill)
    ) {
      const discount = (price * offer.offerpercentage) / 100;
      return parseFloat((price - discount).toFixed(2));
    }

    return price;
  };

  // const calculateOfferPrice = (product) => {
  //   const hasValidOffer =
  //     product.offer &&
  //     product.offer.offerpercentage > 0 &&
  //     (!product.offer.validTill || new Date(product.offer.validTill) > new Date());

  //   if (hasValidOffer) {
  //     const discount = (product.price * product.offer.offerpercentage) / 100;
  //     return product.price - discount;
  //   }
  //   return product.price;
  // };

  const addToCart = (product) => {
    // Prevent adding product if stockquantity is 0 or falsy
    if (!product.stockquantity || convertToBaseUnit(product.stockquantity, product.stockunit) <= 0) {
      toast.error(`${product.name} is out of stock`, {
        toastId: `out-of-stock-${product._id}`,
      });
      return;
    }

    const formattedImage = product.image?.includes("http")
      ? product.image
      : `https://manglore-store-t98r.onrender.com/${product.image.replace(/\\/g, "/")}`;

    const exists = cartItems.find((item) => item._id === product._id);
    const offerPrice = calculateOfferPrice(product);

    if (exists) {
      const stockBase = convertToBaseUnit(exists.stockquantity, exists.stockunit);
      const requestedBase = convertToBaseUnit(exists.weight, exists.unit) * (exists.quantity + 1);

      if (requestedBase > stockBase) {
        toast.error(`Not enough stock for ${exists.name}`, {
          toastId: `stock-${exists._id}`,
        });
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast('Quantity updated in cart', { id: `update-${product._id}` });
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          image: formattedImage,
          quantity: 1,
          stockquantity: product.stockquantity,
          stockunit: product.stockunit,
          offerPrice: offerPrice, // Store calculated offer price
          gst: product.gst || 0,
          offer: product.offer || { offerpercentage: null, validTill: null },
        },
      ]);
      toast.success('Added to cart', { toastId: `add-${product._id}` });
    }
  };

  const changeQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          if (newQty < 1) {
            toast('Removed from cart', { id: `remove-${id}` });
            return null; // Remove item
          }

          const stockBase = convertToBaseUnit(item.stockquantity, item.stockunit);
          const requestedBase = convertToBaseUnit(item.weight, item.unit) * newQty;

          if (requestedBase > stockBase) {
            toast.error(`Not enough stock for ${item.name}`, {
              toastId: `stock-${id}`,
            });
            return item; // No change
          }

          toast('Cart quantity changed', { id: `change-${id}` });
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast.warn('Removed from cart', { toastId: `remove-${id}` });
  };

  const clearCart = () => {
    setCartItems([]);
    toast('Cart cleared', { id: 'clear-cart' });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
        convertToBaseUnit,
        unitToBase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
