import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "The Future of Tech Education in Africa",
    excerpt: "How digital skills training is transforming opportunities across the continent.",
    date: "Jan 25, 2026",
    category: "Education",
  },
  {
    title: "Getting Started with Machine Learning",
    excerpt: "A beginner's guide to understanding AI and machine learning fundamentals.",
    date: "Jan 20, 2026",
    category: "AI/ML",
  },
  {
    title: "Building IoT Solutions for Agriculture",
    excerpt: "Smart farming technologies that are revolutionizing African agriculture.",
    date: "Jan 15, 2026",
    category: "IoT",
  },
  {
    title: "Career Paths in Software Development",
    excerpt: "Exploring different roles and opportunities in the tech industry.",
    date: "Jan 10, 2026",
    category: "Careers",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl lg:text-5xl font-medium text-card-foreground mb-4"
            >
              Blog & Insights
            </motion.h1>
            <p className="text-card-foreground/80 max-w-2xl mx-auto">
              Thought leadership and knowledge sharing on technology, innovation, and digital skills in Africa.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {posts.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 shadow-card border border-border/30 group hover:shadow-card-hover transition-all cursor-pointer"
                >
                  <span className="text-xs text-accent font-medium">{post.category}</span>
                  <h3 className="font-heading text-lg font-semibold text-card-foreground mt-2 mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-card-foreground/70 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-card-foreground/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
