import client from "./client";

export const listCustomers = async () => {
  const response = await client.get("/list-customers");
  return response.data;
};
