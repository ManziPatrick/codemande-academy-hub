import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Database, Wifi, Clock, Users, Award } from "lucide-react";

const programs = [
  {
    icon: Code,
    title: "Software Development",
    duration: "3-6 months",
    level: "Beginner to Advanced",
    format: "Online / Hybrid",
    description: "Learn web and mobile development with modern technologies.",
  },
  {
    icon: Database,
    title: "Data Science & AI",
    duration: "4-6 months",
    level: "Intermediate to Advanced",
    format: "Online",
    description: "Master data analysis, machine learning, and AI systems.",
  },
  {
    icon: Wifi,
    title: "Internet of Things",
    duration: "3-4 months",
    level: "Beginner to Intermediate",
    format: "Online / In-person",
    description: "Build smart connected systems with sensors and automation.",
  },
];

const Training = () => {
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
              Training Programs
            </motion.h1>
            <p className="text-card-foreground/80 max-w-2xl mx-auto mb-6">
              Industry-ready programs designed with theory, practice, and mentorship. 
              All programs include project work and certification.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-card-foreground/70">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> Flexible schedules</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> Expert trainers</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-accent" /> Certified programs</span>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="h-32 bg-gradient-to-br from-card via-card to-accent/10 flex items-center justify-center">
                    <program.icon className="w-12 h-12 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
                      {program.title}
                    </h3>
                    <p className="text-sm text-card-foreground/70 mb-4">{program.description}</p>
                    <div className="space-y-2 text-xs text-card-foreground/60 mb-4">
                      <p><strong>Duration:</strong> {program.duration}</p>
                      <p><strong>Level:</strong> {program.level}</p>
                      <p><strong>Format:</strong> {program.format}</p>
                    </div>
                    <Link to="/contact">
                      <Button variant="gold" size="sm" className="w-full">Apply Now</Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Training;
