import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Target, Lightbulb, Shield, Award, Users, Heart } from "lucide-react";

const values = [
  { icon: Shield, title: "Excellence", description: "Delivering the highest quality in all we do" },
  { icon: Heart, title: "Integrity", description: "Honest and transparent in all interactions" },
  { icon: Lightbulb, title: "Innovation", description: "Embracing new ideas and technologies" },
  { icon: Award, title: "Practical Learning", description: "Hands-on, industry-focused training" },
  { icon: Users, title: "Impact", description: "Creating lasting change in communities" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="font-heading text-3xl lg:text-5xl font-medium text-card-foreground mb-4">
                Who We Are
              </h1>
              <p className="text-card-foreground/80 text-lg">
                A technology training and innovation company focused on building Africa's 
                next generation of digital professionals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-lg shadow-card border border-border/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  <h2 className="font-heading text-2xl font-semibold text-card-foreground">Our Mission</h2>
                </div>
                <p className="text-card-foreground/80 leading-relaxed">
                  To empower individuals and institutions with practical, industry-ready 
                  technology skills that create real opportunities and lasting impact.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-lg shadow-card border border-border/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  <h2 className="font-heading text-2xl font-semibold text-card-foreground">Our Vision</h2>
                </div>
                <p className="text-card-foreground/80 leading-relaxed">
                  To become a leading center of excellence in technology training and 
                  innovation across Africa, shaping the future of digital skills.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground text-center mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <value.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground text-sm mb-1">{value.title}</h3>
                  <p className="text-xs text-card-foreground/60">{value.description}</p>
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

export default About;
