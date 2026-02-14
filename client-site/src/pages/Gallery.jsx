import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  Grid,
  LayoutGrid,
  Eye,
  ZoomIn,
  Sparkles,
  Star,
  Heart,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Image as ImageIcon,
  Play,
  Download,
} from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";
import swivel from "../assets/Swivel.jpg";
import Executivedesk from "../assets/Executivedesk.jpg";
import Cabinet from "../assets/Cabinet.jpg";
import Sofa from "../assets/sofa.png";
import RectangularDesk from "../assets/RectangularDesk.jpg";
import Canteen from "../assets/Canteen Chair.JPG";
import Executivedesk2 from "../assets/Executivedesk2.png";
import Executivedesk3 from "../assets/Executivedesk3.jpg";
import Teller from "../assets/Teller.JPG";
import MetalCabinet from "../assets/MetalCabinet.jpg";
import MetalCabinet1 from "../assets/MetalCabinet1.jpg";
import Orthopedic from "../assets/Orthopedic.jpg";
import Sofa1 from "../assets/Sofa1.png";

// Enhanced products with better data structure
const products = [
  {
    id: 1,
    name: "Ergonomic Swivel Chair",
    category: "Chairs",
    image: swivel,
    description: "Premium ergonomic chair with lumbar support",
    featured: true,
    tags: ["Ergonomic", "Swivel", "Premium"],
  },
  {
    id: 2,
    name: "Executive Desk",
    category: "Desks",
    image: Executivedesk,
    description: "Spacious executive desk for professional workspace",
    featured: true,
    tags: ["Executive", "Spacious", "Professional"],
  },
  {
    id: 3,
    name: "Bookshelf Cabinet",
    category: "Cabinets",
    image: Cabinet,
    description: "Multi-tier storage cabinet for office organization",
    featured: false,
    tags: ["Storage", "Organization", "Multi-tier"],
  },
  {
    id: 4,
    name: "Luxury Sofa Set",
    category: "Sofas",
    image: Sofa,
    description: "Comfortable luxury sofa for reception areas",
    featured: true,
    tags: ["Luxury", "Comfortable", "Reception"],
  },
  {
    id: 5,
    name: "Rectangular Desk",
    category: "Desks",
    image: RectangularDesk,
    description: "Modern rectangular desk with clean lines",
    featured: false,
    tags: ["Modern", "Clean", "Minimalist"],
  },
  {
    id: 6,
    name: "Canteen Chair",
    category: "Chairs",
    image: Canteen,
    description: "Durable canteen chair for dining areas",
    featured: false,
    tags: ["Durable", "Canteen", "Dining"],
  },
  {
    id: 7,
    name: "Premium Executive Desk",
    category: "Desks",
    image: Executivedesk2,
    description: "High-end executive desk with premium finish",
    featured: true,
    tags: ["Premium", "Executive", "High-end"],
  },
  {
    id: 8,
    name: "Designer Sofa",
    category: "Sofas",
    image: Sofa1,
    description: "Contemporary designer sofa with modern appeal",
    featured: true,
    tags: ["Designer", "Contemporary", "Modern"],
  },
  {
    id: 9,
    name: "Executive Workspace",
    category: "Desks",
    image: Executivedesk3,
    description: "Complete executive workspace solution",
    featured: false,
    tags: ["Executive", "Workspace", "Complete"],
  },
  {
    id: 10,
    name: "Orthopedic Chair",
    category: "Chairs",
    image: Orthopedic,
    description: "Orthopedic support chair for health-conscious users",
    featured: true,
    tags: ["Orthopedic", "Health", "Support"],
  },
  {
    id: 11,
    name: "Teller Station Chair",
    category: "Chairs",
    image: Teller,
    description: "Professional teller station seating solution",
    featured: false,
    tags: ["Professional", "Teller", "Station"],
  },
  {
    id: 12,
    name: "Industrial Cabinet",
    category: "Cabinets",
    image: MetalCabinet,
    description: "Heavy-duty metal cabinet for industrial use",
    featured: false,
    tags: ["Industrial", "Heavy-duty", "Metal"],
  },
  {
    id: 13,
    name: "Steel Storage Cabinet",
    category: "Cabinets",
    image: MetalCabinet1,
    description: "Secure steel storage with multiple compartments",
    featured: false,
    tags: ["Steel", "Secure", "Storage"],
  },
];

const categories = [
  { name: "All", icon: LayoutGrid, count: products.length },
  {
    name: "Chairs",
    icon: ImageIcon,
    count: products.filter((p) => p.category === "Chairs").length,
  },
  {
    name: "Desks",
    icon: ImageIcon,
    count: products.filter((p) => p.category === "Desks").length,
  },
  {
    name: "Cabinets",
    icon: ImageIcon,
    count: products.filter((p) => p.category === "Cabinets").length,
  },
  {
    name: "Sofas",
    icon: ImageIcon,
    count: products.filter((p) => p.category === "Sofas").length,
  },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or masonry
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeInUp");
        }
      });
    }, observerOptions);

    // Observe all gallery items
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [selectedCategory, searchTerm]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const openModal = (product) => {
    setModalImage(product);
    const index = filteredProducts.findIndex((p) => p.id === product.id);
    setCurrentImageIndex(index);
  };

  const navigateModal = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % filteredProducts.length
        : (currentImageIndex - 1 + filteredProducts.length) %
          filteredProducts.length;

    setCurrentImageIndex(newIndex);
    setModalImage(filteredProducts[newIndex]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Header />

      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-yellow-600/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 animate-fadeInDown">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Our Collection
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Product Gallery
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fadeInUp animation-delay-200">
            Discover our comprehensive collection of premium office furniture
            designed to enhance productivity and comfort in your workspace.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-fadeInUp animation-delay-400">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search furniture, descriptions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl 
                         focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-lg
                         shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`group relative flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === cat.name
                      ? "bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  <span>{cat.name}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      selectedCategory === cat.name
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-700"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-500 hover:text-green-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "masonry"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-500 hover:text-green-600"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200">
              {filteredProducts.length} items found
            </div>
          </div>
        </div>

        {/* Results Counter and Featured Badge */}
        {searchTerm && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <p className="text-green-800">
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              results found for "
              <span className="font-semibold">{searchTerm}</span>"
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {/* Gallery Grid */}
        <div
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "masonry-grid"
          }`}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`gallery-item group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl 
                        transition-all duration-500 transform hover:-translate-y-2 cursor-pointer opacity-0
                        ${viewMode === "masonry" ? "masonry-item" : ""}`}
              onClick={() => openModal(product)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    Featured
                  </div>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full 
                         hover:bg-white transition-all duration-300 hover:scale-110"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.has(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>

              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-all duration-500"
                >
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2">
                        <ZoomIn className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          View Details
                        </span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white py-3 rounded-xl
                                 font-medium hover:from-green-600 hover:to-yellow-600 transition-all duration-300
                                 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View in Gallery
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or category filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-6 py-3 rounded-xl
                       font-medium hover:from-green-600 hover:to-yellow-600 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Modal Lightbox */}
      {modalImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full mx-auto">
            {/* Modal Navigation */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <span className="text-sm font-medium">
                  {currentImageIndex + 1} / {filteredProducts.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(modalImage.id);
                  }}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      favorites.has(modalImage.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </button>

                <button
                  onClick={() => setModalImage(null)}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {filteredProducts.length > 1 && (
              <>
                <button
                  onClick={() => navigateModal("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/10 backdrop-blur-sm 
                           rounded-full text-white hover:bg-white/20 transition-all duration-300 z-10"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => navigateModal("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-white/10 backdrop-blur-sm 
                           rounded-full text-white hover:bg-white/20 transition-all duration-300 z-10"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Modal Content */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              {/* Modal Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={modalImage.image}
                  alt={modalImage.name}
                  className="w-full h-full object-cover"
                />

                {/* Featured Badge in Modal */}
                {modalImage.featured && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <Star className="w-4 h-4 inline mr-2" />
                      Featured Product
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Info */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    {modalImage.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Share:</span>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {modalImage.name}
                </h2>

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {modalImage.description}
                </p>

                {/* Tags in Modal */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">
                    Features & Tags:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {modalImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-green-100 to-yellow-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/product/${modalImage.id}`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white py-4 px-6 rounded-2xl
                             font-semibold text-center hover:from-green-600 hover:to-yellow-600 transition-all duration-300
                             transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    View Product Details
                  </Link>

                  <button
                    onClick={() => setModalImage(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold
                             hover:bg-gray-200 transition-all duration-300"
                  >
                    Close Gallery
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {filteredProducts.length > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-2xl overflow-x-auto">
                  <div className="flex space-x-3">
                    {filteredProducts.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setModalImage(product);
                          setCurrentImageIndex(index);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          product.id === modalImage.id
                            ? "border-white shadow-lg transform scale-110"
                            : "border-white/30 hover:border-white/60"
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
