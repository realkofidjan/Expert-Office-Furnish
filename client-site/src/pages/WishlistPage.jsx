import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.product_id,
      name: item.name,
      price: item.price,
      images: item.images,
      image_url: item.images?.[0] || null,
      sku: item.sku,
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleRemove = async (item) => {
    await removeFromWishlist(item.product_id);
    toast.success(`${item.name} removed from wishlist`);
  };

  // Loading state
  if (loading && wishlistItems.length === 0) {
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
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Your Favorites
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              My Wishlist
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Your curated collection of favorite office furniture
            </p>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-500"></div>
            <p className="text-gray-600 font-medium">Loading your wishlist...</p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

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
              <Heart className="w-4 h-4" />
              Your Favorites
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              My Wishlist
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Your curated collection of favorite office furniture
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {wishlistItems.length === 0 ? (
          /* Empty State */
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
                  <Heart className="w-16 h-16 text-green-600" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-full animate-ping"></div>
                </div>

                <h3 className="text-4xl font-bold text-gray-800 mb-4">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  Browse our collection and save your favorite pieces to come
                  back to later
                </p>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Browse Products
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div>
            <div
              className={`flex items-center justify-between mb-8 transition-all duration-1000 delay-300 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Saved Items
                  </h2>
                  <p className="text-gray-600">
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "item" : "items"} in your
                    wishlist
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.product_id}
                  className={`group bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-green-300 h-full ring-1 ring-gray-100 hover:ring-green-200 ${
                    isAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: `${400 + index * 100}ms`,
                    transitionDuration: "700ms",
                  }}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-yellow-50/30 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Product Image */}
                  <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name || "Product"}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
                        <Heart className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    {/* Remove button overlay */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 transform hover:scale-110"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Stock badge */}
                    {item.stock !== undefined && (
                      <div className="absolute top-4 left-4">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                            item.stock > 0
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.stock > 0 ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 relative">
                    <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 text-lg mb-2 line-clamp-2">
                      {item.name || "Unnamed Product"}
                    </h3>

                    {item.sku && (
                      <p className="text-xs text-gray-400 mb-3">
                        SKU: {item.sku}
                      </p>
                    )}

                    {item.price != null && (
                      <div className="mb-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                          GH&#8373; {Number(item.price).toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white rounded-2xl text-sm font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>

                      <button
                        onClick={() => handleRemove(item)}
                        className="w-full px-4 py-3 bg-white border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div
              className={`text-center mt-16 transition-all duration-1000 delay-700 ${
                isAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-8 border-2 border-dashed border-green-300 max-w-lg mx-auto">
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  Looking for more?
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Continue Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
