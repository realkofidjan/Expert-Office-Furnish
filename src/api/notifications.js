import client from "./client";

export const addNotification = async (data) => {
  const response = await client.post("/add-notification", data);
  return response.data;
};

export const listNotifications = async () => {
  const response = await client.post("/list-notifications");
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await client.post("/mark-notification-read", {
    notification_id: notificationId,
  });
  return response.data;
};
