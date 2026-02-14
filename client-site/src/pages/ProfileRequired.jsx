import React from "react";
import { Link } from "react-router-dom";
import { User, ArrowRight, LogIn, UserPlus } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ProfileRequired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              <User size={32} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Login Required
            </h1>

            <p className="text-gray-600 mb-8">
              You need to be logged in to access your profile. Please sign in to
              continue.
            </p>

            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
              >
                <LogIn size={18} />
                Sign In
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-green-300 text-green-600 rounded-xl hover:bg-green-50 transition-all"
              >
                <UserPlus size={18} />
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
