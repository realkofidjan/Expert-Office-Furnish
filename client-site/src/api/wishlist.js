import client from "./client";

export const getWishlist = async () => {
  const response = await client.get("/get-wishlist");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await client.post("/add-to-wishlist", null, {
    params: { product_id: productId },
  });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await client.delete("/delete-from-wishlist", {
    params: { product_id: productId },
  });
  return response.data;
};
