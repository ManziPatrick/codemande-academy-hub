import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Shield, Award, Users, Heart, CheckCircle, Globe, BookOpen, Zap } from "lucide-react";
import aboutImage from "@/assets/about-training.jpg";
import heroImage from "@/assets/hero-training.jpg";

const values = [
  { icon: Shield, title: "Excellence", description: "We deliver the highest quality in all our training programs and technology solutions" },
  { icon: Heart, title: "Integrity", description: "Honest and transparent in all interactions with students, partners, and clients" },
  { icon: Lightbulb, title: "Innovation", description: "Embracing new ideas, technologies, and methodologies to stay ahead" },
  { icon: Award, title: "Practical Learning", description: "Hands-on, industry-focused training that prepares you for real-world challenges" },
  { icon: Users, title: "Community Impact", description: "Creating lasting positive change in communities across Africa" },
  { icon: Globe, title: "Global Standards", description: "International curriculum aligned with global industry requirements" },
];

const achievements = [
  { number: "1,200+", label: "Graduates Trained" },
  { number: "50+", label: "Partner Organizations" },
  { number: "95%", label: "Employment Rate" },
  { number: "4", label: "Countries Reached" },
];

const team = [
  { name: "Dr. Jean Baptiste", role: "Founder & CEO", bio: "PhD in Computer Science with 15+ years in tech education" },
  { name: "Marie Claire N.", role: "Head of Training", bio: "Former Google engineer, passionate about African tech talent" },
  { name: "Emmanuel K.", role: "Director of Partnerships", bio: "10+ years building strategic alliances in East Africa" },
  { name: "Sarah M.", role: "Lead Instructor - Software", bio: "Full-stack developer with expertise in modern frameworks" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-card relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-4">
                About CODEMANDE
              </span>
              <h1 className="font-heading text-3xl lg:text-5xl font-medium text-card-foreground mb-6">
                Building Africa's Digital Future, One Developer at a Time
              </h1>
              <p className="text-card-foreground/80 text-lg leading-relaxed">
                CODEMANDE is a premier technology training and innovation company dedicated to 
                equipping individuals and institutions with industry-ready digital skills. 
                Based in Kigali, Rwanda, we are shaping the next generation of African tech professionals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section with Image */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-accent text-sm font-medium uppercase tracking-wider">Our Story</span>
                <h2 className="font-heading text-2xl lg:text-4xl font-medium text-foreground mt-2 mb-6">
                  From Vision to Impact
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2019, CODEMANDE was born from a simple yet powerful observation: 
                    Africa has immense untapped talent, but access to quality, practical tech education 
                    remains limited. We set out to bridge this gap.
                  </p>
                  <p>
                    Starting with just 15 students in a small classroom in Kigali, we have grown into 
                    a recognized center of excellence, training over 1,200 individuals in software development, 
                    data science, artificial intelligence, and IoT technologies.
                  </p>
                  <p>
                    Our approach combines rigorous theoretical foundations with hands-on project work, 
                    ensuring our graduates don't just learn—they can do. We partner with leading tech 
                    companies to align our curriculum with industry needs, giving our students a 
                    competitive edge in the job market.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link to="/training">
                    <Button variant="gold">Explore Programs</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline">Partner With Us</Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-card group">
                  <img
                    src={aboutImage}
                    alt="CODEMANDE training session"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-card-hover border border-border/30">
                  <p className="text-3xl font-heading font-bold text-accent">95%</p>
                  <p className="text-sm text-card-foreground/70">Graduate Employment Rate</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-xl shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Target className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To empower individuals and institutions with practical, industry-ready 
                  technology skills that create real opportunities and lasting impact across Africa.
                </p>
                <ul className="space-y-2">
                  {["Deliver world-class tech training", "Bridge the skills gap", "Create employment opportunities", "Foster innovation ecosystem"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-background p-8 rounded-xl shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Lightbulb className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To become the leading center of excellence in technology training and 
                  innovation across Africa, shaping the future of digital skills and entrepreneurship.
                </p>
                <ul className="space-y-2">
                  {["Pan-African tech education leader", "Hub for innovation & startups", "Trusted industry partner", "Catalyst for digital transformation"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">Our Impact</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mt-2">
                Numbers That Tell Our Story
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {achievements.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl text-center shadow-card border border-border/30 group hover:shadow-card-hover hover:border-accent/30 transition-all"
                >
                  <p className="text-3xl lg:text-4xl font-heading font-bold text-accent mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm text-card-foreground/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">What Drives Us</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground mt-2">
                Our Core Values
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background p-6 rounded-xl shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-card flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <value.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">Our People</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mt-2">
                Meet the Leadership Team
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Industry experts and educators passionate about transforming tech education in Africa.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl text-center shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-card-foreground">{member.name}</h3>
                  <p className="text-sm text-accent mb-2">{member.role}</p>
                  <p className="text-xs text-card-foreground/60 leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground mb-4">
                Ready to Start Your Tech Journey?
              </h2>
              <p className="text-card-foreground/80 mb-6 max-w-xl mx-auto">
                Join thousands of African professionals who have transformed their careers through 
                our industry-focused training programs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/training">
                  <Button variant="gold" size="lg">Explore Programs</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">Contact Us</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
