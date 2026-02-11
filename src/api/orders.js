import client from "./client";

export const confirmOrder = async (orderId) => {
  const response = await client.post("/confirm-order", { order_id: orderId });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await client.post("/cancel-order", { order_id: orderId });
  return response.data;
};

export const confirmDelivery = async (orderId) => {
  const response = await client.post("/confirm-delivery", {
    order_id: orderId,
  });
  return response.data;
};

export const confirmPayment = async (orderId) => {
  const response = await client.post("/confirm-payment", {
    order_id: orderId,
  });
  return response.data;
};
