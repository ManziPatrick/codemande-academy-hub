import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Code, Database, Wifi, Briefcase, BookOpen, Building2 } from "lucide-react";

const trainingServices = [
  { icon: Code, title: "Software Development", description: "Web, mobile, and desktop application development" },
  { icon: Database, title: "Data Science & AI", description: "Data analysis, machine learning, and AI systems" },
  { icon: Wifi, title: "IoT & Smart Systems", description: "Connected devices and automation solutions" },
  { icon: BookOpen, title: "Digital Skills", description: "Essential digital literacy and tools" },
];

const techServices = [
  { icon: Code, title: "Software Development", description: "Custom software solutions for businesses" },
  { icon: Database, title: "Data & AI Solutions", description: "Data-driven insights and intelligent systems" },
  { icon: Wifi, title: "IoT Solutions", description: "Smart connected systems and automation" },
  { icon: Building2, title: "Consultancy", description: "Technology advisory and digital transformation" },
];

const Services = () => {
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
              Our Services
            </motion.h1>
            <p className="text-card-foreground/80 max-w-2xl mx-auto">
              Comprehensive technology training and solutions for individuals and organizations.
            </p>
          </div>
        </section>

        {/* Training Services */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground text-center mb-10">
              Training & Education
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainingServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-lg shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <service.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-card-foreground/70">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Services */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground text-center mb-10">
              Technology Services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background p-6 rounded-lg shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-card flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <service.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
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

export default Services;
