import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getWishlist,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
} from "../api/wishlist";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getWishlist();
      setWishlistItems(data.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-fetch when auth state changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!user) return;

    // Optimistic update: add a placeholder item immediately
    setWishlistItems((prev) => {
      const alreadyExists = prev.some((item) => item.product_id === productId);
      if (alreadyExists) return prev;
      return [...prev, { product_id: productId, added_at: new Date().toISOString() }];
    });

    try {
      await addToWishlistApi(productId);
      // Re-fetch to get the full product data from the server
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // Revert optimistic update on failure
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    // Optimistic update: remove item immediately
    const previousItems = wishlistItems;
    setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));

    try {
      await removeFromWishlistApi(productId);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // Revert optimistic update on failure
      setWishlistItems(previousItems);
    }
  };

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item.product_id === productId);
    },
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
