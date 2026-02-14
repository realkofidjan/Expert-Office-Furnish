import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Gift,
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  Package,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import RelatedProducts from "../components/RelatedProducts";

const suggestions = [
  { id: 1, name: "Modern Desk Lamp", image: "/lamp.png" },
  { id: 2, name: "Ergonomic Keyboard", image: "/keyboard.png" },
  { id: 3, name: "Wireless Mouse", image: "/mouse.png" },
];

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    clearCart,
    applyCoupon,
    clearCoupon,
    coupon,
    discountAmount,
    errorMessage,
  } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const handleQuantityChange = (id, type) => {
    updateQuantity(id, type);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setDiscountMessage("Please enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    setDiscountMessage("");

    try {
      // Check if coupon is valid and applies to cart items
      const success = await applyCoupon(couponCode.trim());

      if (success) {
        setDiscountMessage(
          `Coupon "${couponCode.trim().toUpperCase()}" applied successfully!`
        );
        setCouponCode("");
      } else {
        setDiscountMessage(errorMessage || "Invalid or expired coupon code.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setDiscountMessage("Error applying coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setDiscountMessage("");
    setCouponCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative container mx-auto px-6 text-center">
          <div
            className={`transition-all duration-1000 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-4">
              <ShoppingCart className="w-4 h-4" />
              Shopping Experience
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Your Shopping Cart
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Review your selected items and proceed to checkout
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {cartItems.length === 0 ? (
          <div
            className={`text-center py-20 transition-all duration-1000 delay-300 ${
              isAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 shadow-2xl border border-green-100 max-w-2xl mx-auto relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-yellow-200/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-yellow-200/30 to-green-200/30 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 via-green-50 to-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <ShoppingCart className="w-16 h-16 text-green-600" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-full animate-ping"></div>
                </div>

                <h3 className="text-4xl font-bold text-gray-800 mb-4">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  Discover our premium furniture collection and create your
                  perfect workspace
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    <Package className="w-6 h-6" />
                    Browse Products
                  </button>
                  <button
                    onClick={() => navigate("/gallery")}
                    className="bg-white border-2 border-green-200 text-green-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 hover:border-green-300 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    <Star className="w-6 h-6" />
                    View Gallery
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Premium Quality
                    </h4>
                    <p className="text-sm text-gray-600">
                      Best materials & craftsmanship
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Custom Design
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tailored to your needs
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Fast Delivery
                    </h4>
                    <p className="text-sm text-gray-600">
                      Quick & secure shipping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div
              className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-8 transition-all duration-1000 delay-500 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-gradient-to-r from-green-50 via-white to-yellow-50 px-8 py-6 border-b border-green-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-green-100/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Your Selected Items
                      </h3>
                      <p className="text-gray-600">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"} ready for
                        checkout
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 font-bold text-gray-700">
                    <div className="col-span-6 md:col-span-5">
                      Product Details
                    </div>
                    <div className="col-span-3 md:col-span-4 text-center">
                      Specifications
                    </div>
                    <div className="col-span-3 text-center">Quantity</div>
                  </div>
                </div>
              </div>

              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`border-b border-green-50 last:border-b-0 transition-all duration-700 hover:bg-gradient-to-r hover:from-green-25 hover:to-yellow-25 ${
                    isAnimated
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center p-8 relative">
                    {/* Product Image & Details */}
                    <div className="col-span-6 md:col-span-5 flex items-center gap-6">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <img
                          src={item.images?.[0] || item.image_url}
                          alt={item.name}
                          className="relative z-10 w-20 h-20 md:w-24 md:h-24 object-cover rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-yellow-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-green-600 transition-colors duration-300">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Premium
                          </span>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            Quality
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          Professional office furniture with premium materials
                          and modern design
                        </p>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="col-span-3 md:col-span-4 text-center">
                      <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl px-4 py-3 border border-green-100">
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                          Quantity
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {item.qty} units
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Ready for checkout
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, "decrease")
                          }
                          className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-xl group"
                        >
                          <Minus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        </button>

                        <div className="w-16 h-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-green-200 flex items-center justify-center shadow-inner">
                          <span className="font-bold text-xl text-gray-800">
                            {item.qty}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, "increase")
                          }
                          className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-xl group"
                        >
                          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>

                      {/* Item Actions */}
                      <div className="mt-3">
                        <button className="text-red-400 hover:text-red-600 text-xs font-medium hover:scale-105 transition-all duration-200 flex items-center gap-1 mx-auto">
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <Star className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div
              className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-8 mb-8 transition-all duration-1000 delay-700 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Apply Discount Code
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter your discount code"
                    className="w-full px-6 py-4 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-yellow-600 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  {isApplyingCoupon ? "Applying..." : "Apply Code"}
                </button>
              </div>

              {/* Current Coupon Display */}
              {coupon && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">
                          {coupon.name} ({coupon.code})
                        </p>
                        <p className="text-sm text-green-600">
                          {coupon.discount_type === "percentage"
                            ? `${coupon.discount_value}% off`
                            : `₵${coupon.discount_value} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {discountMessage && (
                <div
                  className={`mt-4 p-4 rounded-xl ${
                    discountMessage.includes("Invalid") ||
                    discountMessage.includes("expired") ||
                    discountMessage.includes("Error")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  <p className="font-medium">{discountMessage}</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div
              className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 p-8 mb-8 transition-all duration-1000 delay-800 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected Items:</span>
                  <span className="font-semibold text-gray-800">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "product" : "products"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="font-semibold text-gray-800">
                    {cartItems.reduce((total, item) => total + item.qty, 0)}{" "}
                    units
                  </span>
                </div>

                {coupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Applied Discount:
                    </span>
                    <span className="font-semibold">
                      {coupon.code} (
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}% off`
                        : `₵${coupon.discount_value} off`}
                      )
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-800">Status:</span>
                    <span className="font-bold text-green-600">
                      Ready for Checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-1000 delay-900 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                className="flex-1 sm:flex-initial px-8 py-4 bg-white/80 backdrop-blur-lg text-gray-700 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-red-300 flex items-center justify-center gap-2"
                onClick={clearCart}
              >
                <Trash2 className="w-5 h-5" />
                Clear Cart
              </button>
              <button className="flex-1 sm:flex-initial px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Update Cart
              </button>
            </div>

            {/* Proceed Button */}
            <div
              className={`text-center transition-all duration-1000 delay-1000 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-green-100 max-w-2xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-yellow-400/5"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Ready to Checkout?
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Complete your order and get your premium office furniture
                    delivered to your door
                  </p>

                  <button
                    onClick={handleProceedToCheckout}
                    className="group px-12 py-5 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-2xl text-xl font-bold hover:from-green-600 hover:to-yellow-600 transition-all duration-500 hover:shadow-2xl hover:scale-105 flex items-center gap-4 mx-auto relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <ShoppingCart className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Proceed to Checkout</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>

                  <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>24-Hour Consultation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Custom Solutions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Expert Advice</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Related Products Section */}
        <div
          className={`transition-all duration-1000 delay-1100 ${
            isAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-8">
            {/* Products similar to cart items */}
            <RelatedProducts
              cartItems={cartItems}
              algorithm="similar"
              title="Complete Your Setup"
              subtitle="Products that go well with your cart items"
              limit={4}
              showAddToCart={true}
            />

            {/* Popular products */}
            <RelatedProducts
              algorithm="popular"
              title="Popular This Week"
              subtitle="Most viewed office furniture by other customers"
              limit={4}
              showAddToCart={true}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
