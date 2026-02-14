import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  CheckCircle,
  XCircle,
  Mail,
  Send,
  Sparkles,
  Star,
  Gift,
  Users,
  TrendingUp,
  Bell,
} from "lucide-react";
import { subscribeNewsletter } from "../api/public";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await subscribeNewsletter(email.toLowerCase().trim(), "newsletter_page");

      setSubmitted(true);
      setEmail("");

      // Reset after showing success
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Subscription error:", err.message);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Latest furniture trends & insights",
    },
    {
      icon: <Gift className="w-5 h-5" />,
      text: "Exclusive offers & early access",
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "Design tips from experts",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Success stories & case studies",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 text-gray-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-yellow-600/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className={`inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Stay Connected
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Stay Informed,{" "}
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Stay Inspired
            </span>
          </h1>

          <p
            className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Join thousands of professionals who get the latest ergonomic tips,
            office design ideas, and exclusive offers delivered to their inbox.
          </p>
        </div>
      </section>

      <main
        className={`relative z-10 flex items-center justify-center px-4 py-12 transition-all duration-700 delay-600 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-green-100 max-w-2xl w-full p-12 relative overflow-hidden">
          {submitted ? (
            <div className="text-center animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome Aboard! 🎉
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Thank you for subscribing! You'll receive your first newsletter
                soon with exclusive insights and offers.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe Another Email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                  Join Our Newsletter
                </h2>
                <p className="text-gray-600 text-lg">
                  Get exclusive access to design trends, productivity tips, and
                  special offers
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-green-50 rounded-2xl"
                  >
                    <div className="p-2 bg-green-100 rounded-xl text-green-600">
                      {benefit.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/70 hover:bg-white/90 focus:bg-white text-lg"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group relative px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Subscribe Now
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {error && (
                  <div className="flex items-center gap-3 text-red-600 font-medium p-4 bg-red-50 rounded-2xl border border-red-200">
                    <XCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to receive marketing emails. You can
                  unsubscribe at any time.
                </p>
              </form>
            </>
          )}

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-green-200 to-yellow-200 rounded-full opacity-50"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-yellow-200 to-green-200 rounded-full opacity-50"></div>
        </div>
      </main>

      {/* Stats Section */}
      <section
        className={`relative py-20 px-4 transition-all duration-700 delay-800 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Newsletter Subscribers</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-yellow-100">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                Weekly
              </div>
              <div className="text-gray-600">Expert Tips & Insights</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">
                Exclusive
              </div>
              <div className="text-gray-600">Offers & Discounts</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
