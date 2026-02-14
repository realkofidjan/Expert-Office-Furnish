import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "api/auth";

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
        localStorage.setItem("user", JSON.stringify(decoded));
      } else {
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      const jwt = data.token;
      localStorage.setItem("token", jwt);
      setToken(jwt);
      const decoded = parseJwt(jwt);
      setUser(decoded);
      localStorage.setItem("user", JSON.stringify(decoded));
      return { success: true, user: decoded };
    } catch (error) {
      const message =
        error.response?.data?.error || "Login failed. Please try again.";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return (
      user &&
      (user.role === "admin" ||
        user.role === "sub-admin" ||
        user.role === "super-admin")
    );
  };

  const isSuperAdmin = () => {
    return user && user.role === "super-admin";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
