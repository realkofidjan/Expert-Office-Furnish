import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
  Crown,
  Users,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLoginOption, setShowLoginOption] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setLoading(true);

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setInfoMessage(
        "Account created successfully! Redirecting to login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);

      if (
        err.message?.includes("already registered") ||
        err.message?.includes("already exists")
      ) {
        setErrorMessage(
          "This email is already registered. Please try logging in instead."
        );
        setShowLoginOption(true);
      } else {
        setErrorMessage(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 text-gray-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 left-20 w-40 h-40 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-24 h-24 bg-gradient-to-r from-yellow-300 to-green-300 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <Header />
      <main
        className={`relative z-10 flex items-center justify-center px-4 py-20 transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="w-full max-w-md">
          {/* Signup Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                Join Expert Office Furnish
              </h2>
              <p className="text-gray-600">
                Create your account and get started
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 flex items-center gap-3 text-red-600 font-medium p-4 bg-red-50 rounded-2xl border border-red-200 animate-fadeIn">
                <AlertCircle className="w-5 h-5" />
                {errorMessage}
              </div>
            )}

            {/* Go to Login Option */}
            {showLoginOption && (
              <div className="mb-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Go to Login Page
                </Link>
              </div>
            )}

            {/* Info Message */}
            {infoMessage && (
              <div className="mb-6 flex items-center gap-3 text-blue-600 font-medium p-4 bg-blue-50 rounded-2xl border border-blue-200 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5" />
                {infoMessage}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <p className="text-gray-600 font-medium">
                  Creating your account...
                </p>
              </div>
            ) : (
              <>
                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 mr-2 text-green-600" />
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        disabled={loading}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Mail className="w-4 h-4 mr-2 text-green-600" />
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Lock className="w-4 h-4 mr-2 text-green-600" />
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        disabled={loading}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                          Create Account
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>

                {/* Account Types Info */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-2xl">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-green-700">
                      Customer Account
                    </p>
                    <p className="text-xs text-gray-600">Shopping Access</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                    <Crown className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-yellow-700">
                      Admin Account
                    </p>
                    <p className="text-xs text-gray-600">Full Management</p>
                  </div>
                </div>
              </>
            )}

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-yellow-200 to-green-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-200 to-yellow-200 rounded-full opacity-50"></div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <Shield className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <p>Secure Registration</p>
              </div>
              <div>
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                <p>Premium Features</p>
              </div>
              <div>
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <p>Instant Access</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
