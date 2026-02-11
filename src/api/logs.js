import client from "./client";

export const getLogs = async (params = {}) => {
  const response = await client.get("/get-logs", { params });
  return response.data;
};
