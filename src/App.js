import "./assets/css/App.css";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <NotificationProvider>
        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          <Route
            path="/*"
            element={
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            }
          />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
