import client from "./client";

export const listCategories = async () => {
  const response = await client.post("/list-categories");
  return response.data;
};

export const addCategory = async (data) => {
  const response = await client.post("/add-category", data);
  return response.data;
};

export const editCategory = async (categoryId, data) => {
  const response = await client.post("/edit-category", {
    category_id: categoryId,
    ...data,
  });
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await client.post("/delete-category", {
    category_id: categoryId,
  });
  return response.data;
};

export const listSubcategories = async (categoryId) => {
  const response = await client.post("/list-subcategories", {
    category_id: categoryId,
  });
  return response.data;
};

export const addSubcategory = async (categoryId, data) => {
  const response = await client.post("/add-subcategory", {
    category_id: categoryId,
    ...data,
  });
  return response.data;
};

export const editSubcategory = async (categoryId, subcategoryId, data) => {
  const response = await client.post("/edit-subcategory", {
    category_id: categoryId,
    subcategory_id: subcategoryId,
    ...data,
  });
  return response.data;
};

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  const response = await client.post("/delete-subcategory", {
    category_id: categoryId,
    subcategory_id: subcategoryId,
  });
  return response.data;
};
