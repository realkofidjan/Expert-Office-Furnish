import client from "./client";

export const getCartItems = async () => {
  const response = await client.get("/get-cart-items");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await client.post("/add-to-cart", {
    product_id: productId,
    quantity,
  });
  return response.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const response = await client.post("/update-cart-quantity", {
    product_id: productId,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await client.delete("/delete-from-cart", {
    params: { product_id: productId },
  });
  return response.data;
};

export const clearCart = async () => {
  const response = await client.delete("/clear-cart");
  return response.data;
};
