import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Heart, 
  Rocket, 
  Landmark 
} from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students & Graduates",
    description: "Building foundational skills",
  },
  {
    icon: Briefcase,
    title: "Working Professionals",
    description: "Upgrading digital capabilities",
  },
  {
    icon: Building2,
    title: "Institutions & Schools",
    description: "Partnership programs",
  },
  {
    icon: Heart,
    title: "NGOs & Organizations",
    description: "Development initiatives",
  },
  {
    icon: Rocket,
    title: "Startups & Businesses",
    description: "Tech solutions & training",
  },
  {
    icon: Landmark,
    title: "Government & Public",
    description: "Digital transformation",
  },
];

export function WhoWeServe() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-accent" />
            <h2 className="font-heading text-3xl lg:text-4xl font-medium text-foreground text-center">
              Who We Serve
            </h2>
            <div className="w-2 h-2 rotate-45 border border-accent" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        {/* Audience Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-lg p-6 text-center h-full shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <audience.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-card-foreground text-sm mb-1">
                  {audience.title}
                </h3>
                <p className="text-xs text-card-foreground/60">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
