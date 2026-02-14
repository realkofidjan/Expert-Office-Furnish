import client from "./client";

export const getAllBlogs = async (params = {}) => {
  const response = await client.get("/get-all-blogs", { params });
  return response.data;
};

export const getBlog = async (blogId) => {
  const response = await client.get("/get-blog", {
    params: { blog_id: blogId },
  });
  return response.data;
};
