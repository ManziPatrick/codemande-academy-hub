import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock, User, Tag } from "lucide-react";
import heroImage from "@/assets/hero-training.jpg";

const featuredPost = {
  title: "The Future of Tech Education in Africa: Trends and Opportunities",
  excerpt: "As Africa's digital economy grows at an unprecedented rate, the demand for skilled tech professionals has never been higher. We explore the key trends shaping tech education and the opportunities they present for individuals and organizations.",
  date: "Jan 25, 2026",
  author: "Dr. Jean Baptiste",
  category: "Education",
  readTime: "8 min read",
};

const posts = [
  {
    title: "Getting Started with Machine Learning: A Beginner's Roadmap",
    excerpt: "A comprehensive guide to understanding AI and machine learning fundamentals, with practical tips on how to begin your journey in data science.",
    date: "Jan 20, 2026",
    author: "Marie Claire N.",
    category: "AI/ML",
    readTime: "6 min read",
  },
  {
    title: "Building IoT Solutions for African Agriculture",
    excerpt: "How smart farming technologies are revolutionizing African agriculture, from soil sensors to automated irrigation systems.",
    date: "Jan 15, 2026",
    author: "Emmanuel K.",
    category: "IoT",
    readTime: "5 min read",
  },
  {
    title: "Career Paths in Software Development: Finding Your Niche",
    excerpt: "Exploring the diverse roles and opportunities in the tech industry, from frontend development to DevOps engineering.",
    date: "Jan 10, 2026",
    author: "Sarah M.",
    category: "Careers",
    readTime: "7 min read",
  },
  {
    title: "Why Soft Skills Matter in Tech Careers",
    excerpt: "Technical skills get you the interview, but soft skills get you the job. Learn why communication, teamwork, and adaptability are essential.",
    date: "Jan 5, 2026",
    author: "Dr. Jean Baptiste",
    category: "Careers",
    readTime: "4 min read",
  },
  {
    title: "Remote Work Best Practices for Developers",
    excerpt: "Tips and strategies for staying productive, maintaining work-life balance, and advancing your career while working remotely.",
    date: "Dec 28, 2025",
    author: "Sarah M.",
    category: "Productivity",
    readTime: "5 min read",
  },
  {
    title: "Introduction to Cloud Computing: AWS, Azure, and GCP",
    excerpt: "A beginner's overview of the three major cloud platforms and how to choose the right one for your projects.",
    date: "Dec 20, 2025",
    author: "Emmanuel K.",
    category: "Cloud",
    readTime: "8 min read",
  },
];

const categories = [
  { name: "All", count: 12 },
  { name: "Education", count: 4 },
  { name: "AI/ML", count: 3 },
  { name: "IoT", count: 2 },
  { name: "Careers", count: 5 },
  { name: "Cloud", count: 2 },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
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
              <span className="inline-block px-4 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-4">
                Blog & Insights
              </span>
              <h1 className="font-heading text-3xl lg:text-5xl font-medium text-card-foreground mb-6">
                Knowledge & Thought Leadership
              </h1>
              <p className="text-card-foreground/80 max-w-2xl mx-auto text-lg">
                Insights, tutorials, and industry perspectives on technology, innovation, 
                and building successful careers in Africa's growing digital economy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl overflow-hidden shadow-card border border-border/30 group hover:shadow-card-hover transition-all cursor-pointer max-w-4xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="h-64 lg:h-auto bg-gradient-to-br from-accent/20 to-card overflow-hidden">
                  <img 
                    src={heroImage} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full w-fit mb-3">
                    Featured
                  </span>
                  <h2 className="font-heading text-xl lg:text-2xl font-semibold text-card-foreground mb-3 group-hover:text-accent transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm text-card-foreground/70 mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-card-foreground/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Blog Grid with Sidebar */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="bg-card p-6 rounded-xl shadow-card border border-border/30 sticky top-24">
                  <h3 className="font-heading font-semibold text-card-foreground mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <button className="w-full flex items-center justify-between text-sm text-card-foreground/70 hover:text-accent transition-colors py-1">
                          <span className="flex items-center gap-2">
                            <Tag className="w-3 h-3" /> {cat.name}
                          </span>
                          <span className="text-xs bg-background px-2 py-0.5 rounded">{cat.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <hr className="my-6 border-border/30" />
                  
                  <h3 className="font-heading font-semibold text-card-foreground mb-4">Newsletter</h3>
                  <p className="text-sm text-card-foreground/70 mb-3">
                    Get the latest articles delivered to your inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm mb-2"
                  />
                  <button className="w-full px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </motion.aside>

              {/* Posts Grid */}
              <div className="lg:col-span-3">
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl p-6 shadow-card border border-border/30 group hover:shadow-card-hover transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-card-foreground/50">{post.readTime}</span>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-card-foreground/70 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-card-foreground/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {post.author}
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <span className="flex items-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </div>
                
                {/* Load More */}
                <div className="text-center mt-10">
                  <button className="px-6 py-3 border border-accent text-accent rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                    Load More Articles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
