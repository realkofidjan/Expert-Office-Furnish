import client from "./client";

export const addToServerCart = async (productId, quantity) => {
  const response = await client.post("/add-to-cart", { product_id: productId, quantity });
  return response.data;
};

export const checkoutItems = async (productIds) => {
  const response = await client.post("/checkout-items", { product_ids: productIds });
  return response.data;
};

export const processCheckout = async () => {
  const response = await client.post("/process-checkout");
  return response.data;
};

export const setOrderAddress = async (orderId, address) => {
  const response = await client.post("/set-order-address", { order_id: orderId, ...address });
  return response.data;
};
