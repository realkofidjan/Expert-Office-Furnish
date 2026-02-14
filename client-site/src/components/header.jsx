import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Star,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getAllProducts } from "../api/products";
import debounce from "lodash.debounce";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Derive display values from the auth context user
  const userName = user?.name || user?.email?.split("@")[0] || "";
  const role = user?.role || "Customer";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Debounced global search (products only — TODO: add blog search when API endpoint is available)
  const handleSearch = debounce(async (term) => {
    if (!term.trim()) return setSearchResults([]);
    try {
      const data = await getAllProducts({ search: term });
      const products = data?.products || data || [];
      setSearchResults(
        products.map((p) => ({
          id: p.id || p.product_id,
          label: p.name,
          type: "product",
        }))
      );
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  }, 400);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-green-100/50 dark:bg-gray-900/95 dark:border-gray-700"
          : "bg-black/20 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img
                src="/Logo.png"
                alt="Expert Office Logo"
                className="h-10 sm:h-12 transition-all duration-300 group-hover:scale-105 drop-shadow-lg"
              />
              <div className="absolute -inset-3 bg-gradient-to-r from-green-400/20 to-yellow-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="ml-3 hidden sm:block">
              <h1
                className={`text-xl font-bold transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent"
                    : "text-white drop-shadow-lg"
                }`}
              >
                Expert Office Furnish
              </h1>
              <p
                className={`text-xs font-medium transition-all duration-300 ${
                  isScrolled ? "text-gray-500" : "text-white/80 drop-shadow-md"
                }`}
              >
                Premium Furniture
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              to="/home"
              className={`relative font-semibold text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-400"
                  : "text-white drop-shadow-lg hover:text-yellow-200"
              }`}
            >
              Home
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/shop"
              className={`relative font-semibold text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-400"
                  : "text-white drop-shadow-lg hover:text-yellow-200"
              }`}
            >
              Products
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/gallery"
              className={`relative font-semibold text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-400"
                  : "text-white drop-shadow-lg hover:text-yellow-200"
              }`}
            >
              Gallery
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/services"
              className={`relative font-semibold text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-400"
                  : "text-white drop-shadow-lg hover:text-yellow-200"
              }`}
            >
              Our Services
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
            <Link
              to="/blog"
              className={`relative font-semibold text-sm transition-all duration-300 hover:scale-105 group ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-400"
                  : "text-white drop-shadow-lg hover:text-yellow-200"
              }`}
            >
              Blog
              <div
                className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            </Link>
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Modern Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 border ${
                  isScrolled
                    ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border-gray-200 hover:border-green-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    : "bg-white/10 text-white hover:bg-white/20 hover:text-yellow-200 border-white/20 hover:border-white/40 drop-shadow-lg"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {showSearch && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg text-gray-800 p-4 rounded-2xl shadow-2xl border border-green-100 animate-fadeIn dark:bg-gray-800/95 dark:text-gray-200 dark:border-gray-600">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 text-sm border border-green-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                    />
                    <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-3 max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          onClick={() => {
                            navigate(`/${result.type}/${result.id}`);
                            setSearchTerm("");
                            setShowSearch(false);
                          }}
                          className="flex items-center justify-between p-3 hover:bg-green-50 cursor-pointer rounded-xl transition-all duration-300 group"
                        >
                          <span className="text-gray-700 group-hover:text-green-600 font-medium">
                            {result.label}
                          </span>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            {result.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modern Cart */}
            <Link to="/cart" className="relative group">
              <div
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 border ${
                  isScrolled
                    ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border-gray-200 hover:border-green-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    : "bg-white/10 text-white hover:bg-white/20 hover:text-yellow-200 border-white/20 hover:border-white/40 drop-shadow-lg"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItems.length}
                  </div>
                )}
              </div>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 border ${
                isScrolled
                  ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border-gray-200 hover:border-green-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-yellow-400"
                  : "bg-white/10 text-white hover:bg-white/20 hover:text-yellow-200 border-white/20 hover:border-white/40 drop-shadow-lg"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Modern User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 border ${
                  isScrolled
                    ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border-gray-200 hover:border-green-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    : "bg-white/10 text-white hover:bg-white/20 hover:text-yellow-200 border-white/20 hover:border-white/40 drop-shadow-lg"
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg text-gray-800 rounded-2xl shadow-2xl border border-green-100 overflow-hidden animate-fadeIn dark:bg-gray-800/95 dark:text-gray-200 dark:border-gray-600">
                  {user ? (
                    <>
                      {/* Username Section */}
                      <div className="px-4 py-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-yellow-50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Sparkles size={8} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">
                              {userName}
                            </div>
                            <div className="text-xs text-gray-600">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-gray-600 font-medium">
                            {role}
                          </span>
                        </div>
                      </div>

                      {/* Profile Link */}
                      <Link
                        to="/profile"
                        className="w-full block px-4 py-3 hover:bg-green-50 transition-colors duration-200"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-green-600" />
                          <span className="text-gray-700 font-medium">
                            Profile
                          </span>
                        </div>
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 text-red-600 border-t border-gray-100"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 hover:bg-green-50 transition-colors duration-200 text-gray-700 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-3 hover:bg-green-50 transition-colors duration-200 text-gray-700 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modern Contact Button */}
            <Link to="/contact">
              <button
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white hover:from-green-600 hover:to-yellow-600 border border-green-400"
                    : "bg-gradient-to-r from-green-400 to-yellow-400 text-white hover:from-green-500 hover:to-yellow-500 border border-white/30 drop-shadow-lg"
                }`}
              >
                <span className="hidden sm:inline">Contact Us</span>
                <span className="sm:hidden">Call</span>
              </button>
            </Link>

            {/* Modern Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 hover:scale-105 border ${
                isScrolled
                  ? "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border-gray-200 hover:border-green-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  : "bg-white/10 text-white hover:bg-white/20 hover:text-yellow-200 border-white/20 hover:border-white/40 drop-shadow-lg"
              }`}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-green-100 animate-slideDown dark:bg-gray-900/95 dark:border-gray-700">
            <div className="py-4 space-y-2">
              <Link
                to="/home"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              <Link
                to="/gallery"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Gallery
              </Link>
              <Link
                to="/services"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Our Services
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Blog
              </Link>

              {/* Profile Link for Mobile - only show if user is logged in */}
              {user && (
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium rounded-xl mx-2 border-t border-gray-200 mt-2 pt-4"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-green-600" />
                    Profile ({userName})
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
