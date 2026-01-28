import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Code, Database, Wifi, ExternalLink } from "lucide-react";

const projects = [
  { icon: Code, title: "E-Commerce Platform", category: "Software Development", description: "Full-stack web application for online retail" },
  { icon: Database, title: "Analytics Dashboard", category: "Data Science", description: "Business intelligence and data visualization" },
  { icon: Wifi, title: "Smart Agriculture System", category: "IoT", description: "Sensor-based farm monitoring solution" },
  { icon: Code, title: "Mobile Banking App", category: "Software Development", description: "Secure mobile financial services application" },
  { icon: Database, title: "Predictive Maintenance AI", category: "AI/ML", description: "Machine learning model for equipment monitoring" },
  { icon: Wifi, title: "Smart Home Controller", category: "IoT", description: "Home automation and energy management" },
];

const Projects = () => {
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
              Projects & Portfolio
            </motion.h1>
            <p className="text-card-foreground/80 max-w-2xl mx-auto">
              Real solutions developed by our teams and students across software, data, AI, and IoT.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="h-40 bg-gradient-to-br from-card via-card to-accent/10 flex items-center justify-center relative">
                    <project.icon className="w-12 h-12 text-accent" strokeWidth={1.5} />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-accent font-medium">{project.category}</span>
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mt-1 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-card-foreground/70">{project.description}</p>
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

export default Projects;
