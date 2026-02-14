import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { login as apiLogin, signup as apiSignup } from "../api/auth";

const AuthContext = createContext();

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
      name: payload.name || payload.email?.split("@")[0] || "User",
    };
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // On mount, check localStorage for an existing token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
      }
    } else if (token) {
      // Token exists but is expired
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await apiLogin(email, password);
    if (result.token) {
      localStorage.setItem("token", result.token);
      const decoded = decodeToken(result.token);
      setUser(decoded);
    }
    return result;
  };

  const signup = async (data) => {
    const result = await apiSignup(data);
    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // --- Inactivity auto-logout timer ---
  const INACTIVITY_TIMEOUT = 300000; // 5 minutes
  const THROTTLE_INTERVAL = 30000; // 30 seconds

  const inactivityTimerRef = useRef(null);
  const lastResetRef = useRef(Date.now());

  const resetInactivityTimer = useCallback(() => {
    const now = Date.now();
    if (now - lastResetRef.current < THROTTLE_INTERVAL) {
      return;
    }
    lastResetRef.current = now;

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setSessionExpired(true);
      logout();
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    if (!user) {
      // User logged out — clear timer and listeners
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    // User is logged in — clear any previous expired flag and start timer
    setSessionExpired(false);
    lastResetRef.current = Date.now();

    inactivityTimerRef.current = setTimeout(() => {
      setSessionExpired(true);
      logout();
    }, INACTIVITY_TIMEOUT);

    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [user, resetInactivityTimer]);
  // --- End inactivity auto-logout timer ---

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isAuthenticated, sessionExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
