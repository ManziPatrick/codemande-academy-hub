import { motion } from "framer-motion";
import { Code, Database, Wifi, Briefcase } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Software Development",
    description: "Design and build modern web and mobile applications using industry best practices.",
  },
  {
    icon: Database,
    title: "Data Science & AI",
    description: "Learn data analysis, machine learning, model training, and intelligent systems development.",
  },
  {
    icon: Wifi,
    title: "Internet of Things (IoT)",
    description: "Develop smart, connected systems using sensors, devices, and automation.",
  },
  {
    icon: Briefcase,
    title: "Internships & Projects",
    description: "Gain hands-on experience through supervised internships and industry-based projects.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header with decorative lines */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-accent" />
            <h2 className="font-heading text-3xl lg:text-4xl font-medium text-foreground text-center">
              What We Do
            </h2>
            <div className="w-2 h-2 rotate-45 border border-accent" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mb-16 max-w-xl mx-auto"
        >
          Our Core Focus Areas
        </motion.p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                {/* Icon area with circuit pattern */}
                <div className="relative h-40 bg-gradient-to-br from-card via-card to-accent/10 flex items-center justify-center">
                  {/* Circuit decoration */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    viewBox="0 0 200 160"
                  >
                    <path
                      d="M0,80 L50,80 L60,60 L100,60 M100,60 L120,80 L150,80 L160,100 L200,100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-accent"
                    />
                    <circle cx="60" cy="60" r="3" className="fill-accent" />
                    <circle cx="120" cy="80" r="3" className="fill-accent" />
                  </svg>
                  
                  <div className="relative w-16 h-16 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-card-foreground/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
