import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthAwareLink } from "@/components/AuthAwareLink";
import { Code, Database, Wifi, Clock, Users, Award, CheckCircle, BookOpen, Target, Briefcase, Calendar, ArrowRight, Brain, Shield, Building2, Stethoscope, GraduationCap, Landmark, ShoppingBag, Factory } from "lucide-react";
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

// AI Courses by Department
const aiCourses = [
  {
    icon: Brain,
    department: "General / All Departments",
    title: "AI Fundamentals & Practical Applications",
    duration: "2-4 weeks",
    level: "Beginner",
    description: "A comprehensive introduction to AI for professionals across all sectors. Learn how to leverage AI tools to boost productivity and understand the basics of responsible AI use.",
    modules: [
      "Introduction to AI, Machine Learning & Deep Learning",
      "Using ChatGPT, Claude & Gemini Effectively",
      "AI for Content Creation & Communication",
      "Prompt Engineering Best Practices",
      "AI-Powered Productivity Tools",
      "Understanding AI Limitations & Biases",
      "Data Privacy & AI Ethics Fundamentals",
      "Recognizing & Preventing AI Misuse"
    ]
  },
  {
    icon: Stethoscope,
    department: "Healthcare",
    title: "AI in Healthcare: Applications & Safety",
    duration: "3-4 weeks",
    level: "Intermediate",
    description: "Explore how AI is transforming healthcare delivery, from diagnostics to patient care, while learning to mitigate risks and ensure patient safety.",
    modules: [
      "AI-Powered Diagnostic Tools & Imaging",
      "Predictive Analytics for Patient Outcomes",
      "Natural Language Processing for Medical Records",
      "AI Chatbots for Patient Engagement",
      "Drug Discovery & Research Applications",
      "HIPAA Compliance & Patient Data Protection",
      "Preventing Algorithmic Bias in Healthcare AI",
      "Clinical Validation & AI Safety Protocols"
    ]
  },
  {
    icon: Landmark,
    department: "Finance & Banking",
    title: "AI in Finance: Innovation & Risk Management",
    duration: "3-4 weeks",
    level: "Intermediate",
    description: "Master AI applications in financial services including fraud detection, algorithmic trading, and customer service while understanding regulatory compliance.",
    modules: [
      "AI for Fraud Detection & Prevention",
      "Credit Scoring & Risk Assessment Models",
      "Algorithmic Trading & Market Analysis",
      "AI-Powered Customer Service & Chatbots",
      "Regulatory Compliance & AI Auditing",
      "Preventing AI-Driven Financial Crimes",
      "Explainable AI for Financial Decisions",
      "Cybersecurity & AI Threat Detection"
    ]
  },
  {
    icon: GraduationCap,
    department: "Education",
    title: "AI in Education: Teaching & Learning Innovation",
    duration: "2-3 weeks",
    level: "Beginner to Intermediate",
    description: "Discover how AI can enhance teaching effectiveness and student learning outcomes while maintaining academic integrity.",
    modules: [
      "AI-Powered Personalized Learning Platforms",
      "Intelligent Tutoring Systems",
      "Automated Grading & Feedback Tools",
      "AI for Special Needs Education",
      "Content Creation with AI Assistance",
      "Detecting AI-Generated Student Work",
      "Promoting Academic Integrity with AI",
      "Ethical AI Use in Educational Settings"
    ]
  },
  {
    icon: ShoppingBag,
    department: "Marketing & Sales",
    title: "AI for Marketing: Customer Engagement & Analytics",
    duration: "2-3 weeks",
    level: "Beginner to Intermediate",
    description: "Learn to leverage AI for customer insights, personalized marketing, and sales optimization while respecting consumer privacy.",
    modules: [
      "AI-Driven Customer Segmentation",
      "Personalization Engines & Recommendation Systems",
      "Predictive Analytics for Sales Forecasting",
      "AI Content Generation for Marketing",
      "Chatbots & Conversational Marketing",
      "Social Media AI Tools & Automation",
      "Consumer Privacy & Data Protection",
      "Avoiding Manipulative AI Practices"
    ]
  },
  {
    icon: Factory,
    department: "Manufacturing & Operations",
    title: "AI in Industry 4.0: Smart Manufacturing",
    duration: "3-4 weeks",
    level: "Intermediate",
    description: "Implement AI solutions for predictive maintenance, quality control, and supply chain optimization in manufacturing environments.",
    modules: [
      "Predictive Maintenance with AI",
      "Computer Vision for Quality Control",
      "AI-Optimized Supply Chain Management",
      "Robotics & Automation Integration",
      "Digital Twins & Simulation",
      "Workforce Safety & AI Monitoring",
      "Preventing AI System Failures",
      "Industrial Cybersecurity Best Practices"
    ]
  },
  {
    icon: Building2,
    department: "Human Resources",
    title: "AI in HR: Talent Management & Ethics",
    duration: "2-3 weeks",
    level: "Beginner to Intermediate",
    description: "Apply AI to streamline recruitment, employee development, and workforce planning while ensuring fair and unbiased practices.",
    modules: [
      "AI-Powered Resume Screening & Matching",
      "Predictive Analytics for Employee Retention",
      "AI Chatbots for Employee Support",
      "Performance Analysis & Feedback Tools",
      "Learning & Development Personalization",
      "Preventing Hiring Bias in AI Systems",
      "Privacy in Employee Monitoring",
      "Legal Compliance & AI in HR"
    ]
  },
  {
    icon: Shield,
    department: "Cybersecurity & IT",
    title: "AI Security: Defense & Threat Prevention",
    duration: "4-5 weeks",
    level: "Advanced",
    description: "Master AI-powered security tools and learn to defend against AI-enhanced cyber threats while building robust security systems.",
    modules: [
      "AI for Threat Detection & Response",
      "Machine Learning in Malware Analysis",
      "Behavioral Analytics & Anomaly Detection",
      "AI-Powered Penetration Testing",
      "Defending Against Adversarial AI Attacks",
      "Deepfake Detection & Prevention",
      "AI Model Security & Hardening",
      "Incident Response with AI Assistance"
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
  { q: "Are AI courses suitable for non-technical staff?", a: "Absolutely! Our department-specific AI courses are designed for professionals at all technical levels, focusing on practical applications rather than coding." },
];

import { useQuery } from "@apollo/client/react";
import { GET_COURSES } from "@/lib/graphql/queries";

const Training = () => {
  const { data, loading } = useQuery(GET_COURSES);
  const courses = (data as any)?.courses || [];

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

            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any, index: number) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30 group hover:shadow-xl transition-all h-full flex flex-col"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-black hover:bg-white border-0 shadow-sm">{course.category}</Badge>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 bg-accent/5 px-2 py-1 rounded-full text-accent font-medium uppercase tracking-wider">{course.level}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-card-foreground mb-3 line-clamp-2">
                        {course.title}
                    </h3>
                    <div 
                        className="text-muted-foreground text-sm mb-6 line-clamp-3 prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                    <div className="mt-auto pt-6 border-t border-border/30 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Instructor</span>
                            <span className="text-sm font-semibold">{course.instructor.username}</span>
                        </div>
                        <Link to={`/course/${course.id}`}>
                            <Button variant="gold" size="sm" className="rounded-full">
                                Details <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Courses Section */}
        <section className="py-16 lg:py-20 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm font-medium uppercase tracking-wider">AI for Every Department</span>
              <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mt-2 mb-4">
                AI Courses: How to Use & How to Prevent Risks
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Empower your teams with practical AI skills. Each course covers both productive AI applications 
                and essential safeguards to prevent misuse, bias, and security risks.
              </p>
            </motion.div>

            {/* AI Overview Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
              <div className="bg-card p-6 rounded-xl text-center shadow-card border border-border/30">
                <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">8</div>
                <div className="text-sm text-card-foreground/70">Department Courses</div>
              </div>
              <div className="bg-card p-6 rounded-xl text-center shadow-card border border-border/30">
                <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">100%</div>
                <div className="text-sm text-card-foreground/70">Include Safety Training</div>
              </div>
              <div className="bg-card p-6 rounded-xl text-center shadow-card border border-border/30">
                <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">Any</div>
                <div className="text-sm text-card-foreground/70">Technical Level</div>
              </div>
              <div className="bg-card p-6 rounded-xl text-center shadow-card border border-border/30">
                <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">Certified</div>
                <div className="text-sm text-card-foreground/70">Upon Completion</div>
              </div>
            </motion.div>

            {/* AI Courses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {aiCourses.map((course, index) => (
                <motion.div
                  key={course.department}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl overflow-hidden shadow-card border border-border/30 hover:shadow-card-hover transition-all group"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                        <course.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <span className="text-accent text-xs font-medium uppercase tracking-wider">{course.department}</span>
                        <h3 className="font-heading text-lg font-semibold text-card-foreground mt-1">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-card-foreground/60">
                      <span className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded">
                        <Target className="w-3 h-3" /> {course.level}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-card-foreground/70 mb-4">{course.description}</p>

                    {/* Modules Preview */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-card-foreground/80 uppercase tracking-wider">Key Modules:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {course.modules.slice(0, 4).map((module, i) => (
                          <div key={i} className="flex items-start gap-1 text-xs text-card-foreground/60">
                            <CheckCircle className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{module}</span>
                          </div>
                        ))}
                      </div>
                      {course.modules.length > 4 && (
                        <p className="text-xs text-accent">+ {course.modules.length - 4} more modules</p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <AuthAwareLink variant="gold" size="sm" className="w-full">
                        Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                      </AuthAwareLink>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Corporate Training CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-card rounded-xl p-8 text-center shadow-card border border-accent/30"
            >
              <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-heading text-xl lg:text-2xl font-semibold text-card-foreground mb-2">
                Need Custom AI Training for Your Organization?
              </h3>
              <p className="text-card-foreground/70 max-w-2xl mx-auto mb-6">
                We design tailored AI training programs for enterprises, government agencies, and institutions. 
                Cover multiple departments with a unified curriculum that addresses your specific industry challenges.
              </p>
              <Link to="/contact">
                <Button variant="gold" size="lg">
                  Request Corporate Training <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
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
                <AuthAwareLink variant="gold" size="lg">Apply Now</AuthAwareLink>
                <AuthAwareLink variant="outline" size="lg">Explore Internships</AuthAwareLink>
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
