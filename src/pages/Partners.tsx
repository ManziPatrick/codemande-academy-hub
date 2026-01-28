import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, Landmark, Heart } from "lucide-react";

const partnerTypes = [
  { icon: Building2, title: "Businesses & Startups", description: "Technology solutions and corporate training" },
  { icon: GraduationCap, title: "Educational Institutions", description: "Academic partnerships and curriculum development" },
  { icon: Landmark, title: "Government Agencies", description: "Digital transformation initiatives" },
  { icon: Heart, title: "NGOs & Development Orgs", description: "Skills development programs" },
];

const Partners = () => {
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
              Partners & Clients
            </motion.h1>
            <p className="text-card-foreground/80 max-w-2xl mx-auto">
              Collaboration for impact. We work with institutions and organizations 
              to deliver quality training and technology solutions.
            </p>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground text-center mb-10">
              Who We Work With
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerTypes.map((partner, index) => (
                <motion.div
                  key={partner.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-lg shadow-card border border-border/30 text-center group hover:shadow-card-hover transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <partner.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground mb-2">{partner.title}</h3>
                  <p className="text-sm text-card-foreground/70">{partner.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground mb-4">
              Become a Partner
            </h2>
            <p className="text-card-foreground/80 mb-6 max-w-xl mx-auto">
              Join us in building Africa's digital future through collaboration and innovation.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="lg">Get in Touch</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
