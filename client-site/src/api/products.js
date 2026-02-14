import client from "./client";

export const getAllProducts = async (params = {}) => {
  const response = await client.get("/get-all-products", { params });
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await client.get("/get-product", {
    params: { product_id: productId },
  });
  return response.data;
};

export const getCategories = async () => {
  const response = await client.get("/list-categories");
  return response.data;
};
