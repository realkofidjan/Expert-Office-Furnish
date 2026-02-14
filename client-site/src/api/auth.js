import client from "./client";

export const login = async (email, password) => {
  const response = await client.post("/login", { email, password });
  return response.data;
};

export const signup = async (data) => {
  const response = await client.post("/signup", data);
  return response.data;
};
