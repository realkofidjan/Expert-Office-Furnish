import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../api/blog";
import { subscribeNewsletter } from "../api/public";
import Header from "../components/header";
import Footer from "../components/footer";
import dataCache, { CACHE_KEYS } from "../utils/dataCache";
import {
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Eye,
  TrendingUp,
  Calendar as CalendarIcon,
  Tag,
  Star,
  ThumbsUp,
  Share2,
  Bookmark,
  ArrowRight,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Zap,
  Sparkles,
  Heart,
} from "lucide-react";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allTags, setAllTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, popular
  const [featuredPost, setFeaturedPost] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const blogsPerPage = viewMode === "grid" ? 9 : 6;

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, selectedCategory, sortBy]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      // Check cache first for instant loading
      const cachedBlogs = dataCache.get(CACHE_KEYS.ALL_BLOGS);

      if (cachedBlogs) {
        setBlogs(cachedBlogs);
        // Set featured post (most recent or most popular)
        if (cachedBlogs.length > 0) {
          setFeaturedPost(cachedBlogs[0]);
        }
        // Extract all unique tags from cached data
        const tags = new Set();
        cachedBlogs.forEach((blog) => {
          if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach((tag) => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
        setLoading(false);
        return;
      }

      // Fetch blogs from the Expert API
      const result = await getAllBlogs({ status: "Published" });
      const blogsData = result.blogs || [];

      setBlogs(blogsData);
      // Set featured post
      if (blogsData.length > 0) {
        setFeaturedPost(blogsData[0]);
      }
      // Cache the blogs for future loads
      dataCache.set(CACHE_KEYS.ALL_BLOGS, blogsData);

      // Extract all unique tags
      const tags = new Set();
      blogsData.forEach((blog) => {
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach((tag) => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      const dummyBlogs = getDummyBlogs();
      setBlogs(dummyBlogs);
      dataCache.set(CACHE_KEYS.ALL_BLOGS, dummyBlogs);
    } finally {
      setLoading(false);
    }
  };

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterMessage("Please enter a valid email address");
      return;
    }

    setNewsletterLoading(true);
    setNewsletterMessage("");

    try {
      await subscribeNewsletter(newsletterEmail.toLowerCase().trim(), "blog_newsletter");

      setNewsletterMessage("Successfully subscribed! Get ready for amazing content in your inbox.");
      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setNewsletterMessage("Thank you for subscribing! We'll keep you updated with our latest content.");
      setNewsletterEmail("");
    } finally {
      setNewsletterLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setNewsletterMessage(""), 5000);
    }
  };

  const getDummyBlogs = () => [
    {
      id: 1,
      title: "The Future of Office Design: Sustainable & Smart Workspaces",
      excerpt:
        "Explore how modern office design is evolving with eco-friendly materials, smart technology integration, and wellness-focused environments that boost productivity.",
      content:
        "The office landscape is undergoing a revolutionary transformation. Modern workspaces are no longer just about desks and chairs; they're becoming ecosystems that support human wellbeing and environmental sustainability. Smart lighting systems adapt to natural circadian rhythms, reducing eye strain and improving focus. Sustainable materials like bamboo, recycled plastics, and reclaimed wood are becoming standard choices. Biophilic design elements bring nature indoors with living walls, natural textures, and abundant plants. Technology integration is seamless with wireless charging surfaces, IoT sensors monitoring air quality, and adaptive furniture that responds to user preferences. The result is spaces that feel more like extensions of our homes while maintaining professional functionality.",
      image_url: "/assets/modern-office.jpg",
      created_at: new Date().toISOString(),
      tags: [
        "office design",
        "sustainability",
        "smart workspace",
        "future trends",
      ],
      status: "Published",
      featured: true,
      readTime: 8,
      views: 1250,
      likes: 89,
    },
    {
      id: 2,
      title:
        "Ergonomic Excellence: Choosing the Perfect Office Chair for Your Health",
      excerpt:
        "Master the art of selecting office furniture that supports your body's natural alignment and prevents workplace injuries with our comprehensive guide.",
      content:
        "Your office chair is perhaps the most important piece of furniture in your workspace, directly impacting your health, comfort, and productivity. Proper lumbar support maintains the natural S-curve of your spine, preventing the rounded shoulders and forward head posture common in desk workers. Adjustable armrests should support your arms at a 90-degree angle, reducing strain on your shoulders and neck. The seat depth should allow 2-3 inches between the back of your knees and the chair edge, promoting healthy blood circulation. Quality materials and construction ensure longevity and consistent support. Consider your specific work habits, body type, and any existing health conditions when making your selection. Remember, the best chair is one that encourages movement and allows for position changes throughout the day.",
      image_url: "/assets/ergonomic-chair.jpg",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      tags: ["ergonomics", "office chair", "health", "workplace wellness"],
      status: "Published",
      featured: false,
      readTime: 6,
      views: 2100,
      likes: 156,
    },
    {
      id: 3,
      title: "Remote Work Revolution: Setting Up Your Perfect Home Office",
      excerpt:
        "Transform any space into a productive home office with expert tips on furniture selection, lighting optimization, and creating work-life boundaries.",
      content:
        "The shift to remote work has transformed how we think about office spaces. Creating an effective home office requires balancing productivity with comfort, professional appearance with personal style. Start with a dedicated workspace, even if it's just a corner of a room. Invest in a quality desk that provides adequate surface area and storage. Good lighting is crucial – combine natural light with task lighting to reduce eye strain. Noise management through strategic furniture placement or sound-absorbing materials can dramatically improve focus. Personal touches like plants, artwork, or meaningful objects can boost mood and creativity while maintaining a professional backdrop for video calls. The key is creating clear boundaries between work and personal life through intentional design choices.",
      image_url: "/assets/home-office.jpg",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      tags: ["remote work", "home office", "productivity", "workspace design"],
      status: "Published",
      featured: false,
      readTime: 7,
      views: 1875,
      likes: 134,
    },
    {
      id: 4,
      title:
        "Color Psychology in Office Environments: Boosting Performance Through Design",
      excerpt:
        "Discover how different colors affect mood, creativity, and productivity in the workplace, and learn to create the perfect color palette for your office.",
      content:
        "Color has a profound psychological impact on our mental state and performance. In office environments, strategic color choices can enhance focus, creativity, and overall wellbeing. Blue tones promote calm concentration and are ideal for detail-oriented tasks. Green reduces eye strain and creates a sense of balance, making it perfect for long work sessions. Yellow stimulates creativity and energy but should be used sparingly to avoid overstimulation. Neutral colors like beige and gray provide a professional foundation while allowing accent colors to make strategic impacts. Red can increase urgency and excitement but may raise stress levels if overused. The key is creating a balanced palette that supports different types of work while maintaining a cohesive, professional appearance.",
      image_url: "/assets/office-colors.jpg",
      created_at: new Date(Date.now() - 259200000).toISOString(),
      tags: [
        "color psychology",
        "office design",
        "productivity",
        "workplace psychology",
      ],
      status: "Published",
      featured: false,
      readTime: 5,
      views: 980,
      likes: 67,
    },
    {
      id: 5,
      title:
        "Storage Solutions That Actually Work: Organizing Your Modern Office",
      excerpt:
        "Say goodbye to clutter with innovative storage solutions that keep your workspace organized, efficient, and visually appealing.",
      content:
        "Effective storage is the backbone of any organized workspace. Modern offices require solutions that are both functional and aesthetically pleasing. Vertical storage maximizes space efficiency with tall bookcases and wall-mounted cabinets. Modular systems adapt to changing needs and can grow with your business. Hidden storage maintains clean lines while keeping necessary items accessible. Digital storage integration reduces paper clutter while ensuring important documents remain secure. Personal storage areas give employees ownership over their space while maintaining overall organization. The best storage systems are intuitive, making it easy to maintain organization long-term. Consider both current needs and future growth when planning storage solutions.",
      image_url: "/assets/office-storage.jpg",
      created_at: new Date(Date.now() - 345600000).toISOString(),
      tags: [
        "organization",
        "storage solutions",
        "office efficiency",
        "workspace",
      ],
      status: "Published",
      featured: false,
      readTime: 4,
      views: 1456,
      likes: 98,
    },
    {
      id: 6,
      title:
        "The Art of Office Lighting: Creating the Perfect Ambiance for Work",
      excerpt:
        "Learn how proper lighting design can transform your office environment, reduce fatigue, and create spaces that inspire and energize your team.",
      content:
        "Lighting is often overlooked in office design, yet it's one of the most important factors affecting employee wellbeing and productivity. Natural light is ideal, reducing eye strain and supporting healthy circadian rhythms. When natural light is limited, full-spectrum LED lights provide the closest alternative. Task lighting eliminates shadows and reduces glare on computer screens. Ambient lighting creates overall illumination and atmosphere. Accent lighting highlights architectural features or creates visual interest. Adjustable lighting allows users to customize their environment throughout the day. Smart lighting systems can automatically adjust based on time of day, weather conditions, or specific activities. The goal is creating a comfortable, visually appealing environment that supports various types of work while minimizing eye strain and fatigue.",
      image_url: "/assets/office-lighting.jpg",
      created_at: new Date(Date.now() - 432000000).toISOString(),
      tags: [
        "lighting design",
        "office ambiance",
        "workplace wellness",
        "LED lighting",
      ],
      status: "Published",
      featured: false,
      readTime: 6,
      views: 1678,
      likes: 112,
    },
  ];

  const filterAndSortBlogs = () => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.tags &&
            blog.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    // Filter by category/tag
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (blog) => blog.tags && blog.tags.includes(selectedCategory)
      );
    }

    // Sort blogs
    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const calculateReadTime = (content, excerpt = "") => {
    // Use content if available, otherwise use excerpt, with fallback to empty string
    const textToAnalyze = content || excerpt || "";
    if (!textToAnalyze || typeof textToAnalyze !== "string") return 1; // Default to 1 min if no content

    // Remove HTML tags if any and split by words
    const plainText = textToAnalyze.replace(/<[^>]*>/g, "");
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Average reading speed is 200-250 words per minute, using 200 for conservative estimate
    return Math.max(1, Math.ceil(wordCount / 200)); // Minimum 1 minute
  };

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-bl from-yellow-100/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-green-100/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-50/20 to-yellow-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-200/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Expert Insights & Trends
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-green-800 mb-6">
            Office{" "}
            <span className="bg-gradient-to-r from-green-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover expert insights, latest trends, and practical tips for
            creating extraordinary workspaces that inspire productivity and
            success.
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                {blogs.length}+
              </div>
              <div className="text-sm text-gray-600">Expert Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                {allTags.length}+
              </div>
              <div className="text-sm text-gray-600">Topics Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-gray-600">Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 text-white">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-3 py-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Featured Article</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-200 text-lg mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-6 mb-6 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(featuredPost.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime ||
                      calculateReadTime(
                        featuredPost.content,
                        featuredPost.excerpt
                      )}{" "}
                    min read
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {featuredPost.views || 0} views
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredPost.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 border border-white/20 text-white text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-600 hover:from-green-600 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Read Full Article
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="relative bg-gradient-to-br from-green-500/20 to-yellow-500/20 flex items-center justify-center p-8">
                {featuredPost.image_url ? (
                  <img
                    src={featuredPost.image_url}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-64 lg:h-full bg-gradient-to-br from-green-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-white/80" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Search and Filter Section */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 backdrop-blur-sm bg-white/90">
          {/* Top Row - Search and Main Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, topics, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 flex items-center gap-2 transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 flex items-center gap-2 transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Row */}
          <div
            className={`${
              isFilterOpen ? "block" : "hidden lg:block"
            } space-y-4 lg:space-y-0`}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Category Filter */}
              <div className="relative lg:w-64">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50"
                >
                  <option value="all">All Categories</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="relative lg:w-64">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {sortBy === "newest" ? (
                    <SortDesc className="w-4 h-4" />
                  ) : (
                    <SortAsc className="w-4 h-4" />
                  )}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50"
                >
                  <option value="newest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm ||
                selectedCategory !== "all" ||
                sortBy !== "newest") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortBy("newest");
                  }}
                  className="px-4 py-3 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-200 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredBlogs.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {blogs.length}
                </span>{" "}
                articles
                {searchTerm && (
                  <span>
                    {" "}
                    for "
                    <span className="font-medium text-green-600">
                      {searchTerm}
                    </span>
                    "
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span>
                    {" "}
                    in{" "}
                    <span className="font-medium text-green-600">
                      {selectedCategory}
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-500">
                  Instant search results
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid/List */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        {currentBlogs.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={blog.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200 overflow-hidden animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Blog Image */}
                    <div className="relative overflow-hidden group/image">
                      {blog.image_url ? (
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-green-500 via-yellow-500 to-green-500 flex items-center justify-center relative">
                          <BookOpen className="w-16 h-16 text-white opacity-80" />
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <div className="flex gap-2">
                          <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <Link
                          to={`/blog/${blog.id}`}
                          className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-white hover:shadow-lg"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(blog.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {blog.readTime ||
                              calculateReadTime(
                                blog.content,
                                blog.excerpt
                              )}{" "}
                            min
                          </div>
                        </div>
                        {blog.views && (
                          <div className="flex items-center text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            {blog.views}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-green-800 group-hover:text-green-600 transition-colors mb-3 line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                              onClick={() => setSelectedCategory(tag)}
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{blog.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/blog/${blog.id}`}
                          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group/link"
                        >
                          Read More
                          <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                        </Link>

                        {blog.likes && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <ThumbsUp className="w-4 h-4" />
                            {blog.likes}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-6">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={blog.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-80 h-48 md:h-auto relative overflow-hidden">
                        {blog.image_url ? (
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white opacity-80" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 md:p-8">
                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {new Date(blog.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {blog.readTime ||
                              calculateReadTime(
                                blog.content,
                                blog.excerpt
                              )}{" "}
                            min read
                          </div>
                          {blog.views && (
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              {blog.views} views
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-green-800 group-hover:text-green-600 transition-colors mb-3 leading-tight">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        {/* Tags and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {blog.tags?.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                                onClick={() => setSelectedCategory(tag)}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            {blog.likes && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <ThumbsUp className="w-4 h-4" />
                                {blog.likes}
                              </div>
                            )}
                            <Link
                              to={`/blog/${blog.id}`}
                              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              Read Article
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-300 text-8xl mb-6">📄</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No articles found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "all"
                ? "We couldn't find any articles matching your criteria. Try adjusting your search or filter settings."
                : "Our content library is being updated. Check back soon for fresh insights and expert advice."}
            </p>
            {(searchTerm ||
              selectedCategory !== "all" ||
              sortBy !== "newest") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSortBy("newest");
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-green-500 to-yellow-600 text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  currentPage < totalPages && paginate(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                }`}
              >
                Next
              </button>
            </div>

            {/* Results per page info */}
            <div className="text-sm text-gray-600">{blogsPerPage} per page</div>
          </div>
        </section>
      )}

      {/* Enhanced Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-20 -translate-y-20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-purple-300 rounded-full transform translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-green-300 rounded-full transform translate-x-18 translate-y-18"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Weekly Insights</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get the latest office design trends, productivity tips, and
              exclusive content delivered straight to your inbox every week.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={newsletterLoading}
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none border-0 disabled:opacity-60"
              />
              <button 
                type="submit"
                disabled={newsletterLoading}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:transform-none disabled:hover:scale-100"
              >
                {newsletterLoading ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>

            {newsletterMessage && (
              <div className={`max-w-md mx-auto mb-4 p-3 rounded-lg text-sm font-medium ${
                newsletterMessage.includes("already") || newsletterMessage.includes("Successfully") 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : newsletterMessage.includes("valid") 
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
                {newsletterMessage}
              </div>
            )}

            <p className="text-sm opacity-70">
              Join 10,000+ professionals • No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
