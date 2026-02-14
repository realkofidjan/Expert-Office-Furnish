import client from "./client";

export const getProfile = async () => {
  const response = await client.get("/get-customer-profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await client.post("/update-customer-profile", data);
  return response.data;
};
