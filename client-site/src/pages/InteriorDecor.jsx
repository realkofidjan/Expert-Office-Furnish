import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Award,
  Users,
  Star,
  ExternalLink,
  CheckCircle2,
  Palette,
  Home,
  Lightbulb,
  Target,
} from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";
import Pinnacle from "../assets/Pinnacle.jpg";
import Calbank from "../assets/Calbank.jpg";
import ExpertOffice from "../assets/ExpertOffice.jpg";

const InteriorDecor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      title: "Accra Corporate Headquarters",
      img: Pinnacle,
      path: "https://photos.app.goo.gl/DuRGyy2zFmyqiCch6",
      description:
        "Modern corporate headquarters with sleek design and premium furnishings",
      category: "Corporate",
      year: "2024",
    },
    {
      title: "Financial Center - East Legon",
      img: Calbank,
      path: "https://photos.app.goo.gl/DmyHSgGh9hdYqbF39",
      description:
        "Elegant banking environment combining functionality with luxury",
      category: "Financial",
      year: "2023",
    },
    {
      title: "Expert Office Showroom",
      img: ExpertOffice,
      path: "https://photos.app.goo.gl/iqCriFyAFtvXFHTf8",
      description: "Contemporary showroom showcasing our furniture collections",
      category: "Showroom",
      year: "2024",
    },
  ];

  const handleViewPortfolio = () => {
    // Scroll to the portfolio section on the same page
    const portfolioSection = document.getElementById("portfolio-section");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Interior Design",
      description:
        "Custom interior design solutions tailored to your brand and workspace needs",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Space Planning",
      description:
        "Optimize your office layout for maximum efficiency and employee satisfaction",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Lighting Design",
      description:
        "Create the perfect ambiance with professional lighting solutions",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Project Management",
      description: "End-to-end project management from concept to completion",
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
        <div className="relative max-w-6xl mx-auto text-center">
          <div
            className={`inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Palette className="w-4 h-4 mr-2" />
            Interior Design & Office Solutions
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Transform Your{" "}
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Workspace Vision
            </span>
            <br />
            Into Reality
          </h1>

          <p
            className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Your trusted partner in creating inspiring, functional, and
            beautiful workspaces that enhance productivity and reflect your
            brand identity.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 transition-all duration-700 delay-600 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Link to="/inquiry">
              <button className="group px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Project
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>

            <button
              onClick={handleViewPortfolio}
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-200 text-green-700 rounded-2xl font-semibold hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                View Portfolio
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className={`relative py-20 px-4 transition-all duration-700 delay-800 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Our Design Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive interior design solutions for modern workspaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-yellow-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-green-600 group-hover:text-green-700 transition-colors">
                    {service.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-green-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Portfolio Section */}
      <section
        id="portfolio-section"
        className={`relative py-20 px-4 bg-white/50 backdrop-blur-sm transition-all duration-700 delay-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our portfolio of stunning office transformations and
              design excellence
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3"
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Overlay Info */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {project.year}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      hoveredProject === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <a
                      href={project.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white text-green-700 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center shadow-2xl"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Project
                    </a>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex justify-between items-center">
                    {project.path ? (
                      <a
                        href={project.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors"
                      >
                        View Gallery
                        <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Gallery coming soon
                      </span>
                    )}

                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className={`relative py-20 px-4 transition-all duration-700 delay-1200 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-100 p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl mb-8">
              <Award className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-6">
              Ready to Transform Your Space?
            </h2>

            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Let our expert design team create a workspace that inspires your
              team and reflects your company's values. From concept to
              completion, we handle every detail.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  15+
                </div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  200+
                </div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  98%
                </div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/inquiry">
                <button className="group px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    24-Hour Consultation Offer
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>

              <Link to="/contact">
                <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-200 text-green-700 rounded-2xl font-semibold hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center">
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Contact Us
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InteriorDecor;
