import React from "react";
import Profile from "../pages/Profile";

// Simple wrapper to help with HMR issues
const ProfileWrapper = () => {
  return <Profile />;
};

// Add display name for better debugging
ProfileWrapper.displayName = "ProfileWrapper";

export default ProfileWrapper;
