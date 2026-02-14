import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  addToServerCart,
  checkoutItems,
  processCheckout,
  setOrderAddress,
} from "../api/orders";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Check,
  Package,
  Truck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const steps = [
  { id: 1, label: "Order Review", icon: ShoppingCart },
  { id: 2, label: "Delivery Address", icon: MapPin },
  { id: 3, label: "Confirm & Pay", icon: CreditCard },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart, coupon, discountAmount } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState(null);

  const [addressData, setAddressData] = useState({
    full_name: user?.name || "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    region: "",
    country: "Ghana",
    delivery_instructions: "",
  });

  useEffect(() => {
    if (user?.name && !addressData.full_name) {
      setAddressData((prev) => ({ ...prev, full_name: user.name }));
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.qty,
    0
  );
  const total = Math.max(0, subtotal - discountAmount);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const isAddressValid = () => {
    return (
      addressData.full_name.trim() &&
      addressData.phone.trim() &&
      addressData.address_line1.trim() &&
      addressData.city.trim() &&
      addressData.region.trim() &&
      addressData.country.trim()
    );
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError("");

    try {
      // Step 1: Add each item to the server cart
      for (const item of cartItems) {
        await addToServerCart(item.id, item.qty);
      }

      // Step 2: Checkout selected items
      await checkoutItems(cartItems.map((item) => item.id));

      // Step 3: Process the checkout to create an order
      const checkoutResult = await processCheckout();
      const orderId = checkoutResult.order_id;

      // Step 4: Set the delivery address
      await setOrderAddress(orderId, addressData);

      // Step 5: Clear the local cart
      clearCart();

      // Step 6: Show success
      setCompletedOrderId(orderId);
      setOrderSuccess(true);
    } catch (err) {
      console.error("Checkout error:", err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong while placing your order. Please try again.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  // ── Empty Cart State ──
  if (!orderSuccess && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="bg-white rounded-3xl p-16 shadow-xl border border-green-100 max-w-xl mx-auto">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some items to your cart before checking out.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              <Package className="w-5 h-5" />
              Browse Shop
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Order Success State ──
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <Header />
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="bg-white rounded-3xl p-16 shadow-xl border border-green-100 max-w-xl mx-auto">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Check className="w-14 h-14 text-green-600" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 mb-2">
              Thank you for your order. We will process it shortly.
            </p>
            {completedOrderId && (
              <p className="text-lg font-semibold text-green-700 mb-8">
                Order ID:{" "}
                <span className="bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                  {completedOrderId}
                </span>
              </p>
            )}
            <button
              onClick={() => navigate("/shop")}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Main Checkout Flow ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Checkout
          </h1>
          <p className="text-lg text-white/90">
            Complete your order in a few simple steps
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="container mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white shadow-lg"
                          : isActive
                          ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:block ${
                        isActive || isCompleted
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full mx-3 transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* ── Step 1: Order Review ── */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 px-8 py-6 border-b border-green-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                Order Review
              </h2>
              <p className="text-gray-500 mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>

            <div className="divide-y divide-green-50">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 p-6 hover:bg-green-50/30 transition-colors"
                >
                  <img
                    src={item.images?.[0] || item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-2xl shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {item.price
                        ? `\u20B5${(item.price * item.qty).toFixed(2)}`
                        : "Price on request"}
                    </p>
                    {item.qty > 1 && item.price && (
                      <p className="text-xs text-gray-400">
                        \u20B5{item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-gradient-to-r from-green-50/50 to-yellow-50/50 px-8 py-6 border-t border-green-100 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">
                  \u20B5{subtotal.toFixed(2)}
                </span>
              </div>
              {coupon && discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-2">
                    Discount ({coupon.code})
                  </span>
                  <span className="font-semibold">
                    -\u20B5{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-green-200">
                <span>Total</span>
                <span className="text-green-700">
                  \u20B5{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 py-6 flex justify-between items-center">
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-yellow-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Delivery Address ── */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 px-8 py-6 border-b border-green-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Truck className="w-6 h-6 text-green-600" />
                Delivery Address
              </h2>
              <p className="text-gray-500 mt-1">
                Where should we deliver your order?
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={addressData.full_name}
                  onChange={handleAddressChange}
                  placeholder="John Doe"
                  className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={addressData.phone}
                  onChange={handleAddressChange}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={addressData.address_line1}
                  onChange={handleAddressChange}
                  placeholder="Street address, P.O. box"
                  className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address Line 2{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={addressData.address_line2}
                  onChange={handleAddressChange}
                  placeholder="Apartment, suite, unit, floor, etc."
                  className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* City & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Accra"
                    className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={addressData.region}
                    onChange={handleAddressChange}
                    placeholder="e.g. Greater Accra"
                    className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Instructions{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="delivery_instructions"
                  value={addressData.delivery_instructions}
                  onChange={handleAddressChange}
                  rows={3}
                  placeholder="Any special instructions for the delivery driver..."
                  className="w-full px-5 py-3 border-2 border-green-100 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 py-6 border-t border-green-100 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!isAddressValid()}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-yellow-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Review Order
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirm & Place Order ── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Items Summary */}
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 px-8 py-6 border-b border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Package className="w-6 h-6 text-green-600" />
                  Order Summary
                </h2>
              </div>

              <div className="divide-y divide-green-50">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-8 py-4"
                  >
                    <img
                      src={item.images?.[0] || item.image_url}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-800">
                      {item.price
                        ? `\u20B5${(item.price * item.qty).toFixed(2)}`
                        : "TBD"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-8 py-5 border-t border-green-100 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>\u20B5{subtotal.toFixed(2)}</span>
                </div>
                {coupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon.code})</span>
                    <span>-\u20B5{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-green-200">
                  <span>Total</span>
                  <span className="text-green-700">
                    \u20B5{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address Summary */}
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 px-8 py-5 border-b border-green-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Delivery Address
                </h3>
              </div>
              <div className="px-8 py-6 text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-800">
                  {addressData.full_name}
                </p>
                <p>{addressData.phone}</p>
                <p>{addressData.address_line1}</p>
                {addressData.address_line2 && (
                  <p>{addressData.address_line2}</p>
                )}
                <p>
                  {addressData.city}, {addressData.region}
                </p>
                <p>{addressData.country}</p>
                {addressData.delivery_instructions && (
                  <p className="mt-3 text-sm text-gray-500 italic">
                    Note: {addressData.delivery_instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Edit Address
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-yellow-600 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {processing ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
