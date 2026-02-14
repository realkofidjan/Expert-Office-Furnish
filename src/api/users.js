import client from "./client";

export const changeUserRole = async (targetUserId, newRole) => {
  const response = await client.post("/change-user-role", {
    target_user_id: targetUserId,
    new_role: newRole,
  });
  return response.data;
};
