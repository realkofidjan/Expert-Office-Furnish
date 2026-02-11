import client from "./client";

export const listQuotes = async () => {
  const response = await client.post("/list-quotes");
  return response.data;
};

export const getQuote = async (data) => {
  const response = await client.post("/get-quote", data);
  return response.data;
};
