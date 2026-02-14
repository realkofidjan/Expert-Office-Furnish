import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  Award,
  Target,
  Zap,
  Heart,
  Shield,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";
import Design from "../assets/Design.jpg";
import Refurbish from "../assets/Refurbish.jpg";
import Consultancy from "../assets/Consultancy.jpg";
import Fitouts from "../assets/Fitouts.jpg";
import Interior from "../assets/Interior Decor.jpg";
import ExpertOffice from "../assets/ExpertOffice.jpg";

const services = [
  {
    title: "Furniture Providers",
    description:
      "Premium office furniture solutions tailored to your business needs and budget.",
    detailedDescription:
      "High-quality, ergonomic furniture designed to enhance productivity and comfort in any office environment.",
    image: ExpertOffice,
    path: "/shop",
    icon: <Users className="w-6 h-6" />,
    features: [
      "Ergonomic Design",
      "Quality Materials",
      "Custom Solutions",
      "Budget-Friendly",
    ],
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Office Design",
    description:
      "Expert 2D/3D design services to optimize your workspace layout and functionality.",
    detailedDescription:
      "Professional design consultation with detailed 2D and 3D visualizations to create the perfect office environment.",
    image: Design,
    path: "/interior-decor",
    icon: <Lightbulb className="w-6 h-6" />,
    features: [
      "2D/3D Visualization",
      "Space Planning",
      "Furniture Selection",
      "Layout Optimization",
    ],
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Office Fitouts",
    description:
      "Complete turnkey fitout solutions from concept to completion.",
    detailedDescription:
      "End-to-end fitout services including planning, design, procurement, and installation for modern office spaces.",
    image: Fitouts,
    path: "/inquiry",
    icon: <Target className="w-6 h-6" />,
    features: [
      "Turnkey Solutions",
      "Project Management",
      "Quality Installation",
      "Timeline Delivery",
    ],
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Consultancy",
    description:
      "Strategic consulting for office planning, design optimization, and staff training.",
    detailedDescription:
      "Expert advisory services covering project planning, space optimization, and comprehensive staff training programs.",
    image: Consultancy,
    path: "/inquiry",
    icon: <Award className="w-6 h-6" />,
    features: [
      "Strategic Planning",
      "Expert Advice",
      "Training Programs",
      "Ongoing Support",
    ],
    color: "from-yellow-500 to-orange-600",
  },
  {
    title: "Office Refurbishment",
    description:
      "Transform existing spaces into modern, functional work environments.",
    detailedDescription:
      "Complete office makeovers that blend style, comfort, and functionality while respecting your budget and timeline.",
    image: Refurbish,
    path: "/inquiry",
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      "Modern Makeovers",
      "Budget Conscious",
      "Style & Comfort",
      "Quick Turnaround",
    ],
    color: "from-red-500 to-pink-600",
  },
  {
    title: "Interior Decoration",
    description:
      "Comprehensive interior design solutions that reflect your corporate identity.",
    detailedDescription:
      "Tailored interior decoration services incorporating corporate colors and branding to create inspiring work environments.",
    image: Interior,
    path: "/interior-decor",
    icon: <Heart className="w-6 h-6" />,
    features: [
      "Corporate Branding",
      "Color Coordination",
      "Productivity Focus",
      "Aesthetic Appeal",
    ],
    color: "from-teal-500 to-green-600",
  },
];

export default function OurServicesPage() {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const observerRef = useRef(null);

  const handleServiceInquiry = (serviceName) => {
    navigate("/inquiry", {
      state: {
        fromCart: false,
        includeProducts: false,
        fromService: true,
        serviceName: serviceName,
        cartItems: [],
      },
    });
  };

  // Initialize intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(
              (prev) => new Set([...prev, entry.target.dataset.index])
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observerRef.current = observer;

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Add cards to observer when component mounts
  useEffect(() => {
    if (!isLoading) {
      const cards = document.querySelectorAll('[data-animate="card"]');
      cards.forEach((card) => {
        if (observerRef.current) {
          observerRef.current.observe(card);
        }
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading our amazing services...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-yellow-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 animate-fadeInDown">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Office Solutions
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fadeInUp">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Workspace
            </span>
          </h1>

          <div className="max-w-2xl mx-auto mb-12 animate-fadeInUp animation-delay-200">
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive office solutions designed to enhance productivity,
              comfort, and style. From furniture to full fitouts, we create
              spaces that inspire success.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animation-delay-400">
            <Link
              to="/shop"
              className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-4 rounded-2xl font-semibold 
                       hover:from-green-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl flex items-center group"
            >
              Browse Products
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <button
              onClick={() => handleServiceInquiry("General Consultation")}
              className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 
                       hover:border-green-500 hover:text-green-600 transition-all duration-300 transform hover:scale-105 
                       shadow-sm hover:shadow-lg flex items-center group"
            >
              Get Consultation
              <Shield className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Our Comprehensive Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every service is crafted with precision and attention to detail,
            ensuring your workspace reflects your vision and enhances your
            team's productivity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              data-animate="card"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                visibleCards.has(index.toString())
                  ? "animate-fadeInUp opacity-100"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Service Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Floating Icon */}
                <div
                  className={`absolute top-6 left-6 p-3 bg-gradient-to-r ${
                    service.color
                  } rounded-2xl text-white shadow-lg transform transition-all duration-300 ${
                    hoveredCard === index ? "scale-110 rotate-12" : ""
                  }`}
                >
                  {service.icon}
                </div>

                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300 ${
                    hoveredCard === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="text-white">
                    <h4 className="text-lg font-semibold mb-2">
                      {service.title}
                    </h4>
                    <p className="text-sm opacity-90">
                      {service.detailedDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                {service.path === "/inquiry" ? (
                  <button
                    onClick={() => handleServiceInquiry(service.title)}
                    className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-6 rounded-2xl font-semibold 
                                   hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center group`}
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                ) : (
                  <Link to={service.path}>
                    <button
                      className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-6 rounded-2xl font-semibold 
                                     hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center group`}
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-r from-green-600 to-yellow-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Our Mission
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold mb-6">
            Creating Exceptional Workspaces
          </h3>

          <p className="text-xl leading-relaxed mb-8 opacity-95">
            At Expert Office Furnish, our mission is to transform ordinary
            office spaces into extraordinary work environments. We combine years
            of expertise with innovative design solutions to create spaces that
            enhance productivity, boost morale, and reflect your company's
            unique identity.
          </p>

          <div className="grid sm:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">500+ Clients</h4>
              <p className="text-sm opacity-90">
                Trusted by businesses nationwide
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">15+ Years</h4>
              <p className="text-sm opacity-90">
                Industry experience and expertise
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Premium Quality</h4>
              <p className="text-sm opacity-90">
                Only the finest materials and craftsmanship
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
