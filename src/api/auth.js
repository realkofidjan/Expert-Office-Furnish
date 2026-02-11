import client from "./client";

export const login = async (email, password) => {
  const response = await client.post("/login", { email, password });
  return response.data;
};

export const signup = async (userData) => {
  const response = await client.post("/signup", userData);
  return response.data;
};
