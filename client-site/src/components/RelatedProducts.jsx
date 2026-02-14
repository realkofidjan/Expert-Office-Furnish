import React, { useState, useEffect, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  ArrowRight,
  ShoppingCart,
  Eye,
  TrendingUp,
  Users,
  Sparkles,
  Heart,
} from "lucide-react";
import { getAllProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import {
  getPersonalizedRecommendations,
  getRecentlyViewed,
  getAdaptiveRecommendations,
  trackInterest,
} from "../utils/userBehaviorTracker";

const RelatedProducts = memo(
  ({
    currentProductId = null,
    currentCategoryId = null,
    cartItems = [],
    title = "Related Products",
    subtitle = null,
    algorithm = "category", // "category", "popular", "trending", "similar", "personalized", "recent", "adaptive"
    limit = 4,
    showAddToCart = true,
  }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const { addToCart } = useCart();

    const performFetch = async () => {
      if (loading) return;

      try {
        setLoading(true);
        let params = { limit };
        let products = [];

        switch (algorithm) {
          case "category":
            if (currentCategoryId) {
              params.category_id = currentCategoryId;
            }
            break;
          case "similar":
            if (cartItems && cartItems.length > 0) {
              const categoryIds = cartItems
                .map((item) => item.category_id)
                .filter(Boolean);
              if (categoryIds.length > 0) {
                params.category_id = categoryIds[0];
              }
            }
            break;
          case "personalized":
            try {
              const personalizedProducts = await getPersonalizedRecommendations(limit);
              setRelatedProducts(personalizedProducts || []);
              setLoading(false);
              return;
            } catch {
              // Fallback to general products
            }
            break;
          case "recent":
            try {
              const recentlyViewed = getRecentlyViewed(limit);
              if (recentlyViewed.length > 0) {
                // Just fetch general products as fallback since we can't query by IDs
                break;
              }
            } catch {
              // Fallback
            }
            break;
          case "adaptive":
            try {
              const adaptiveProducts = await getAdaptiveRecommendations(currentProductId, limit);
              setRelatedProducts(adaptiveProducts || []);
              setLoading(false);
              return;
            } catch {
              // Fallback
            }
            break;
          default:
            if (currentCategoryId) {
              params.category_id = currentCategoryId;
            }
        }

        const result = await getAllProducts(params);
        products = (result.products || []).map((p) => ({
          ...p,
          image_url: p.images?.[0] || null,
        }));

        // Exclude current product
        if (currentProductId) {
          products = products.filter((p) => p.id !== currentProductId);
        }

        // Exclude cart items for similar algorithm
        if (algorithm === "similar" && cartItems?.length > 0) {
          const cartIds = cartItems.map((item) => item.id);
          products = products.filter((p) => !cartIds.includes(p.id));
        }

        if (products.length === 0 && currentCategoryId) {
          // Fallback: fetch without category filter
          const fallbackResult = await getAllProducts({ limit });
          products = (fallbackResult.products || []).map((p) => ({
            ...p,
            image_url: p.images?.[0] || null,
          }));
        }

        setRelatedProducts(products.slice(0, limit));
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Use useEffect to trigger fetch with debounce
    useEffect(() => {
      const timer = setTimeout(() => {
        if (!hasInitialized) {
          console.log("🔄 RelatedProducts useEffect triggered after debounce");
          setHasInitialized(true);
          performFetch();
        } else if (hasInitialized && !loading) {
          console.log("🔄 RelatedProducts refetch triggered");
          performFetch();
        }
      }, 100); // Small debounce to prevent rapid re-renders

      return () => clearTimeout(timer);
    }, [currentProductId, currentCategoryId, algorithm, limit]);

    const handleAddToCart = (product, e) => {
      e.preventDefault(); // Prevent navigation when clicking add to cart
      addToCart({ ...product, quantity: 1 });

      // Track user interest for better recommendations
      if (product.category_id) {
        trackInterest(product.category_id, product.subcategory_id, "addToCart");
      }

      // Visual feedback
      const button = e.target.closest("button");
      const originalContent = button.innerHTML;
      button.innerHTML =
        '<svg class="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
      button.classList.add("bg-green-600", "border-green-600");

      setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove("bg-green-600", "border-green-600");
      }, 1500);
    };

    const getAlgorithmIcon = () => {
      switch (algorithm) {
        case "popular":
          return <TrendingUp className="w-6 h-6 mr-3 text-green-600" />;
        case "trending":
          return <Sparkles className="w-6 h-6 mr-3 text-green-600" />;
        case "similar":
          return <Users className="w-6 h-6 mr-3 text-green-600" />;
        case "personalized":
          return <Heart className="w-6 h-6 mr-3 text-green-600" />;
        case "recent":
          return <Eye className="w-6 h-6 mr-3 text-green-600" />;
        case "adaptive":
          return <Sparkles className="w-6 h-6 mr-3 text-purple-600" />;
        default:
          return <Grid className="w-6 h-6 mr-3 text-green-600" />;
      }
    };

    if (loading && relatedProducts.length === 0) {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (relatedProducts.length === 0) {
      console.log("🚫 RelatedProducts: No products to display, returning null");
      return null;
    }

    console.log(
      "🎨 RelatedProducts: Rendering",
      relatedProducts.length,
      "products"
    );

    // Error boundary for product rendering
    const renderProduct = (product, index) => {
      try {
        return (
          <div key={product.id || index} className="group relative">
            <Link
              to={`/products/${product.id}`}
              className="block bg-white rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                <img
                  src={product.image_url || "/api/placeholder/200/200"}
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/200/200";
                  }}
                />

                {/* View Count Badge - simulated */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-600 flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {Math.floor(Math.random() * 500 + 100)}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist logic here
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                  {product.name || "Unnamed Product"}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description ||
                    "Premium quality office furniture designed for modern workspaces."}
                </p>

                {/* Category */}
                {product.category_name && (
                  <div className="mb-3">
                    <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs font-medium">
                      {product.category_name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">
                    View Details
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            </Link>

            {/* Add to Cart Button */}
            {showAddToCart && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-lg transform hover:scale-110 transition-all duration-200"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      } catch (error) {
        console.error("Error rendering product:", error, product);
        return null;
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              {getAlgorithmIcon()}
              {title}
            </h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>

          {relatedProducts.length === limit && (
            <Link
              to="/shop"
              className="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts
            .map((product, index) => renderProduct(product, index))
            .filter(Boolean)}
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-yellow-50 rounded-full px-6 py-3 border border-green-200">
            <Sparkles className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-gray-700 font-medium">
              {algorithm === "similar"
                ? "Complete your office setup"
                : "Discover more amazing products"}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

RelatedProducts.displayName = "RelatedProducts";

export default RelatedProducts;
