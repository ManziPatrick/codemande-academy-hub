import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock, User, Tag, Search, Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-training.jpg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  category: string;
  image: string;
  createdAt: string;
  tags: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/graphql', '') || 'http://localhost:4000';

const Blog = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    { name: "All", count: blogs.length },
    { name: "Rwanda Tech", count: blogs.filter(b => b.category === "Rwanda Tech").length },
    { name: "Future Tech", count: blogs.filter(b => b.category === "Future Tech").length },
    { name: "Business", count: blogs.filter(b => b.category === "Business").length },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/blogs`;
      if (category !== "All") {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.content.toLowerCase().includes(search.toLowerCase())
  );

  const featuredPost = blogs[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Blog | CODEMANDE - Rwanda Tech Insights</title>
        <meta name="description" content="Stay updated with the latest in Rwanda Tech, Future Technologies, and Business strategies from the experts at CODEMANDE." />
      </Helmet>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-card relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-4 uppercase tracking-wider">
                Insights & Innovation
              </span>
              <h1 className="font-heading text-3xl lg:text-6xl font-medium mb-6">
                The CODEMANDE Blog
              </h1>
              <p className="text-card-foreground/80 max-w-2xl mx-auto text-lg">
                Exploring the intersection of practical technology, AI, and business growth across Rwanda and Africa.
              </p>
            </motion.div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && category === "All" && (
              <section className="py-12 bg-background">
                <div className="container mx-auto px-4 lg:px-8">
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-card rounded-xl overflow-hidden shadow-card border border-border/30 group hover:shadow-card-hover transition-all cursor-pointer max-w-5xl mx-auto"
                    >
                      <div className="grid lg:grid-cols-2 gap-0">
                        <div className="h-64 lg:h-auto bg-muted overflow-hidden">
                          <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6 lg:p-10 flex flex-col justify-center">
                          <div className="flex gap-2 mb-4">
                            <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">
                              Featured
                            </span>
                            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-full">
                              {featuredPost.category}
                            </span>
                          </div>
                          <h2 className="font-heading text-2xl lg:text-4xl font-semibold mb-4 group-hover:text-accent transition-colors">
                            {featuredPost.title}
                          </h2>
                          <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                            {featuredPost.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {new Date(featuredPost.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" /> {featuredPost.authorName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </div>
              </section>
            )}

            {/* Blog Grid with Sidebar */}
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-4 gap-12">
                  {/* Sidebar */}
                  <aside className="lg:col-span-1 space-y-10">
                    <div className="bg-card p-6 rounded-xl border border-border/50">
                      <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                        <Search className="w-4 h-4 text-accent" /> Search
                      </h3>
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                      />
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border/50">
                      <h3 className="font-heading font-bold text-lg mb-4">Categories</h3>
                      <ul className="space-y-2">
                        {categories.map((cat) => (
                          <li key={cat.name}>
                            <button
                              onClick={() => setCategory(cat.name)}
                              className={`w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-all ${category === cat.name
                                  ? "bg-accent text-accent-foreground font-bold"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <Tag className="w-3 h-3" /> {cat.name}
                              </span>
                              <span className="text-xs bg-black/10 px-2 py-0.5 rounded">{cat.count}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  {/* Posts Grid */}
                  <div className="lg:col-span-3">
                    <div className="grid md:grid-cols-2 gap-8">
                      {filteredBlogs.map((post, index) => (
                        <Link to={`/blog/${post.slug}`} key={post._id}>
                          <motion.article
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card rounded-2xl overflow-hidden border border-border/50 group hover:shadow-xl transition-all h-full flex flex-col"
                          >
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                  {post.category}
                                </span>
                              </div>
                              <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                                {post.content.substring(0, 120)}...
                              </p>
                              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-accent" /> {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-accent" /> {post.authorName}
                                </span>
                              </div>
                            </div>
                          </motion.article>
                        </Link>
                      ))}
                    </div>

                    {filteredBlogs.length === 0 && (
                      <div className="text-center py-20 text-muted-foreground">
                        <h3 className="text-xl">No articles found matching your criteria.</h3>
                        <p className="mt-2">Try searching for something else or changing categories.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
