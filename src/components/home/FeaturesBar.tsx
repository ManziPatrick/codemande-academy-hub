import { motion } from "framer-motion";
import { BookOpen, Briefcase, Lightbulb } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Expert Training",
    description: "Learn from skilled instructors.",
  },
  {
    icon: Briefcase,
    title: "Hands-On Internships",
    description: "Gain real-world experience.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Projects",
    description: "Work on cutting-edge solutions.",
  },
];

export function FeaturesBar() {
  return (
    <section className="relative py-6 -mt-12 z-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-background rounded-lg shadow-card border border-border/50 p-5 lg:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-md bg-card flex items-center justify-center flex-shrink-0 group-hover:shadow-gold-glow transition-shadow duration-300">
                  <feature.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
