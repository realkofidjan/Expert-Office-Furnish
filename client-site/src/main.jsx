import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileWrapper from "./components/ProfileWrapper";
import "./index.css";
import CartPage from "./pages/CartPage";
import OurServicesPage from "./pages/OurServices";
import InteriorDecor from "./pages/InteriorDecor";
import Gallery from "./pages/Gallery";
import ProductInquiry from "./pages/InquiryPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import NewsletterForm from "./pages/NewsletterForm";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import { backgroundPrefetch } from "./utils/prefetch";

// ProtectedRoute component
const ProtectedRoute = ({ children, showLoginPage = false }) => {
  const { user, loading } = useAuth();
  const [showQuickAccess, setShowQuickAccess] = React.useState(false);

  // Show quick access after 1 second if still loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowQuickAccess(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Logging you in...</p>
          {showQuickAccess && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Taking longer than expected?
              </p>
              <div className="space-x-4">
                <a
                  href="/login"
                  className="text-green-600 hover:underline text-sm"
                >
                  Try Login Again
                </a>
                <a href="/" className="text-green-600 hover:underline text-sm">
                  Go Home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLoginPage) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center">
          <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8 text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Login Required
            </h1>
            <p className="text-gray-600 mb-8">
              You need to be logged in to access your profile.
            </p>
            <div className="space-y-4">
              <a
                href="/login"
                className="block w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="block w-full border-2 border-green-500 text-green-600 py-3 px-6 rounded-full font-semibold hover:bg-green-50 transition-all duration-300"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center py-16">
        You must log in to access this page.
      </div>
    );
  }
  return children;
};

const root = createRoot(document.getElementById("root"));

// Start background prefetching for instant loading
backgroundPrefetch();

root.render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute showLoginPage={true}>
                      <ProfileWrapper />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/services" element={<OurServicesPage />} />
                <Route path="/interior-decor" element={<InteriorDecor />} />
                <Route
                  path="/inquiry"
                  element={
                    <ProtectedRoute>
                      <ProductInquiry />
                    </ProtectedRoute>
                  }
                />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/newsletter" element={<NewsletterForm />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route
                  path="*"
                  element={
                    <div className="text-center py-16">404 - Page Not Found</div>
                  }
                />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
