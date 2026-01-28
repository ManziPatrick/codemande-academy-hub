import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Database, Wifi, Clock, Users, Award, CheckCircle, BookOpen, Target, Briefcase, Calendar, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-training.jpg";
import aboutImage from "@/assets/about-training.jpg";

const programs = [
  {
    icon: Code,
    title: "Software Development",
    duration: "3-6 months",
    level: "Beginner to Advanced",
    format: "Online / Hybrid",
    price: "Contact for pricing",
    description: "Master web and mobile development with modern technologies used by leading tech companies.",
    curriculum: [
      "HTML5, CSS3 & Responsive Design",
      "JavaScript ES6+ & TypeScript",
      "React.js / Vue.js Frontend Frameworks",
      "Node.js & Express Backend Development",
      "Database Design: SQL & NoSQL",
      "REST API & GraphQL Development",
      "Git Version Control & Collaboration",
      "Testing, Debugging & Deployment"
    ],
    outcomes: [
      "Build production-ready web applications",
      "Portfolio with 3-5 real projects",
      "Industry-recognized certification",
      "Job placement assistance"
    ]
  },
  {
    icon: Database,
    title: "Data Science & AI",
    duration: "4-6 months",
    level: "Intermediate to Advanced",
    format: "Online",
    price: "Contact for pricing",
    description: "Learn to extract insights from data and build intelligent systems using machine learning and AI.",
    curriculum: [
      "Python Programming for Data Science",
      "Statistical Analysis & Probability",
      "Data Visualization: Matplotlib, Seaborn, Tableau",
      "Machine Learning with Scikit-learn",
      "Deep Learning with TensorFlow/PyTorch",
      "Natural Language Processing (NLP)",
      "Big Data Tools: Spark & Hadoop",
      "MLOps & Model Deployment"
    ],
    outcomes: [
      "Analyze complex datasets effectively",
      "Build predictive ML models",
      "Data Science project portfolio",
      "Preparation for industry certifications"
    ]
  },
  {
    icon: Wifi,
    title: "Internet of Things (IoT)",
    duration: "3-4 months",
    level: "Beginner to Intermediate",
    format: "Online / In-person",
    price: "Contact for pricing",
    description: "Design and build smart connected systems with sensors, microcontrollers, and cloud platforms.",
    curriculum: [
      "Electronics Fundamentals & Circuits",
      "Arduino & Raspberry Pi Programming",
      "Sensor Integration & Data Collection",
      "Wireless Communication Protocols",
      "MQTT & IoT Data Protocols",
      "Cloud IoT Platforms (AWS IoT, Azure IoT)",
      "IoT Security Best Practices",
      "Capstone: Smart Agriculture/Home Project"
    ],
    outcomes: [
      "Build functional IoT prototypes",
      "Understand sensor-to-cloud architecture",
      "Hands-on project experience",
      "Ready for IoT developer roles"
    ]
  },
];

const features = [
  { icon: Clock, title: "Flexible Schedules", description: "Evening and weekend classes available for working professionals" },
  { icon: Users, title: "Expert Instructors", description: "Learn from industry practitioners with real-world experience" },
  { icon: Award, title: "Recognized Certification", description: "Earn certificates valued by employers across Africa" },
  { icon: BookOpen, title: "Project-Based Learning", description: "Build a portfolio with real projects, not just theory" },
  { icon: Target, title: "Career Support", description: "Resume review, interview prep, and job placement assistance" },
  { icon: Briefcase, title: "Internship Opportunities", description: "Access to internship placements with partner companies" },
];

const faqs = [
  { q: "Do I need prior experience?", a: "For beginner-level programs, no prior experience is needed. We start from fundamentals. Intermediate programs require basic programming knowledge." },
  { q: "What is the class schedule?", a: "We offer flexible schedules including weekday evenings (6-9 PM) and weekend sessions. Full-time intensive options are also available." },
  { q: "Will I get a certificate?", a: "Yes, all graduates receive an industry-recognized certificate upon successful completion of their program and capstone project." },
  { q: "Is job placement guaranteed?", a: "While we cannot guarantee employment, we have a 95% job placement rate within 6 months of graduation and provide comprehensive career support." },
];

const Training = () => {
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
                Training Programs
              </span>
              <h1 className="font-heading text-3xl lg:text-5xl font-medium text-card-foreground mb-6">
                Industry-Ready Technology Training
              </h1>
              <p className="text-card-foreground/80 max-w-2xl mx-auto text-lg mb-8">
                Comprehensive programs designed with industry input, delivered by experts, 
                and focused on practical skills that employers demand.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-card-foreground/70">
                <span className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-accent" /> Flexible schedules
                </span>
                <span className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-accent" /> Expert trainers
                </span>
                <span className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full">
                  <Award className="w-4 h-4 text-accent" /> Certified programs
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">Our Programs</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mt-2 mb-4">
                Choose Your Learning Path
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each program includes hands-on projects, mentorship, and career support to ensure 
                you're ready for real-world challenges.
              </p>
            </motion.div>

            <div className="space-y-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl overflow-hidden shadow-card border border-border/30 group hover:shadow-card-hover transition-all"
                >
                  <div className="grid lg:grid-cols-3 gap-0">
                    {/* Program Header */}
                    <div className="p-6 lg:p-8 bg-gradient-to-br from-card to-accent/5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center">
                          <program.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-semibold text-card-foreground">
                            {program.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-card-foreground/70 mb-6">{program.description}</p>
                      <div className="space-y-2 text-sm text-card-foreground/60 mb-6">
                        <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> <strong>Duration:</strong> {program.duration}</p>
                        <p className="flex items-center gap-2"><Target className="w-4 h-4 text-accent" /> <strong>Level:</strong> {program.level}</p>
                        <p className="flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> <strong>Format:</strong> {program.format}</p>
                      </div>
                      <Link to="/contact">
                        <Button variant="gold" className="w-full">
                          Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>

                    {/* Curriculum */}
                    <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border/30">
                      <h4 className="font-heading font-semibold text-card-foreground mb-4">What You'll Learn</h4>
                      <ul className="space-y-2">
                        {program.curriculum.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-card-foreground/80">
                            <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outcomes */}
                    <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border/30 bg-background/50">
                      <h4 className="font-heading font-semibold text-card-foreground mb-4">What You'll Achieve</h4>
                      <ul className="space-y-3">
                        {program.outcomes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-card-foreground/80">
                            <Award className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative h-64 lg:h-80 rounded-xl overflow-hidden group"
            >
              <img 
                src={aboutImage} 
                alt="Training session at CODEMANDE" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/90 to-transparent flex items-center">
                <div className="px-8 lg:px-12 max-w-lg">
                  <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-card-foreground mb-3">
                    Hands-On Learning Environment
                  </h3>
                  <p className="text-card-foreground/80">
                    Our training facilities feature modern equipment and collaborative spaces 
                    designed for effective learning.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Train With Us */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">The CODEMANDE Difference</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground mt-2">
                Why Train With Us?
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-card-foreground/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">Got Questions?</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mt-2">
                Frequently Asked Questions
              </h2>
            </motion.div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl shadow-card border border-border/30"
                >
                  <h4 className="font-heading font-semibold text-card-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm text-card-foreground/70">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground mb-4">
                Start Your Tech Career Today
              </h2>
              <p className="text-card-foreground/80 mb-6 max-w-xl mx-auto">
                Join our next cohort and take the first step toward a rewarding career in technology. 
                Enrollment is now open!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button variant="gold" size="lg">Apply Now</Button>
                </Link>
                <Link to="/internships">
                  <Button variant="outline" size="lg">Explore Internships</Button>
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

export default Training;
