import client from "./client";

export const subscribeNewsletter = async (email, source = "website") => {
  const response = await client.post("/subscribe-newsletter", { email, source });
  return response.data;
};

export const submitContact = async (data) => {
  const response = await client.post("/submit-contact", data);
  return response.data;
};

export const submitInquiry = async (data) => {
  const response = await client.post("/submit-inquiry", data);
  return response.data;
};

export const applyCoupon = async (code, cartTotal) => {
  const response = await client.post("/apply-coupon", { code, cart_total: cartTotal });
  return response.data;
};
