import { motion } from "framer-motion";
import { Shield, Award, Users, Globe } from "lucide-react";

const trustIndicators = [
  { icon: Shield, label: "Trusted Institution" },
  { icon: Award, label: "Certified Programs" },
  { icon: Users, label: "1000+ Trained" },
  { icon: Globe, label: "Africa-Wide Impact" },
];

export function TrustStrip() {
  return (
    <section className="py-6 bg-card border-y border-border/20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
        >
          {trustIndicators.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-2 text-card-foreground/70"
            >
              <item.icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
