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

export const createProduct = async (formData) => {
  const response = await client.post("/create-product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const editProduct = async (productId, data) => {
  const response = await client.post("/edit-product", {
    product_id: productId,
    ...data,
  });
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await client.delete("/delete-product", {
    params: { product_id: productId },
  });
  return response.data;
};

export const addProductImages = async (productId, formData) => {
  formData.append("product_id", productId);
  const response = await client.post("/add-product-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProductImage = async (productId, imageUrls) => {
  const response = await client.post("/delete-product-image", {
    product_id: productId,
    image_urls: imageUrls,
  });
  return response.data;
};

export const batchProductUpload = async (formData) => {
  const response = await client.post("/batch-product-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const validateBatchUpload = async (formData) => {
  const response = await client.post("/validate-batch-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
