import { createContext, useContext, useEffect, useState } from "react";
import { applyCoupon as applyCouponApi } from "../api/public";

const CartContext = createContext();

const CART_STORAGE_KEY = "cartItems";

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
    const exists = cartItems.find((item) => item.id === product.id);
    if (exists) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, qty: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id, action) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty:
                action === "increase"
                  ? item.qty + 1
                  : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    clearCoupon();
  };

  // Apply coupon via API
  const applyCoupon = async (code) => {
    setErrorMessage("");

    const cartTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    try {
      const result = await applyCouponApi(code, cartTotal);

      if (result.error) {
        setErrorMessage(result.error);
        return false;
      }

      setCoupon(result.coupon || { code });
      setDiscountAmount(result.discount_amount || 0);
      setErrorMessage("");
      return true;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid or expired coupon code.";
      setErrorMessage(message);
      return false;
    }
  };

  // Clear coupon
  const clearCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
    setErrorMessage("");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        clearCoupon,
        coupon,
        discountAmount,
        errorMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
