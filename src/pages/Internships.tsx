import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, Database, Wifi, Award, FolderOpen, Users } from "lucide-react";

const internships = [
  { icon: Code, title: "Software Development Intern", duration: "3 months", type: "Online" },
  { icon: Database, title: "Data Science Intern", duration: "3 months", type: "Online" },
  { icon: Wifi, title: "IoT Development Intern", duration: "3 months", type: "Online" },
];

const benefits = [
  { icon: FolderOpen, title: "Real Projects", description: "Work on industry-level projects" },
  { icon: Users, title: "Mentorship", description: "Guidance from experienced professionals" },
  { icon: Award, title: "Certification", description: "Earn a certificate upon completion" },
];

const Internships = () => {
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
              Internships & Work Experience
            </motion.h1>
            <p className="text-card-foreground/80 max-w-2xl mx-auto">
              Gain hands-on experience through structured online internships. 
              Work on real projects under professional supervision.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Internships */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground text-center mb-10">
              Available Internships
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {internships.map((internship, index) => (
                <motion.div
                  key={internship.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background p-6 rounded-lg shadow-card border border-border/30 text-center group hover:shadow-card-hover transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-card flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <internship.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{internship.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{internship.duration}</p>
                  <p className="text-xs text-muted-foreground/70 mb-4">{internship.type}</p>
                  <Link to="/contact">
                    <Button variant="gold" size="sm">Apply</Button>
                  </Link>
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

export default Internships;
