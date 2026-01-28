import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-28 bg-card overflow-hidden">
      {/* Circuit decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left circuit */}
        <svg
          className="absolute top-0 left-0 w-64 h-64 -translate-x-1/3 -translate-y-1/3"
          viewBox="0 0 200 200"
        >
          <path
            d="M100,0 L100,60 L140,100 L200,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent/30"
          />
          <circle cx="100" cy="60" r="3" className="fill-accent/50" />
          <circle cx="140" cy="100" r="3" className="fill-accent/50" />
        </svg>

        {/* Bottom right circuit */}
        <svg
          className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/3 translate-y-1/3"
          viewBox="0 0 200 200"
        >
          <path
            d="M0,100 L60,100 L100,140 L100,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent/30"
          />
          <circle cx="60" cy="100" r="3" className="fill-accent/50" />
          <circle cx="100" cy="140" r="3" className="fill-accent/50" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
            <div className="w-3 h-3 rotate-45 border border-accent" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-medium text-card-foreground mb-4">
            Join the Future of Tech in Africa
          </h2>
          <p className="text-lg text-card-foreground/80 mb-10 font-heading italic">
            Get Started with CODEMANDE Today!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl">
              Get Started
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              className="border-card-foreground/30 text-card-foreground hover:border-accent hover:text-accent"
            >
              View Programs
            </Button>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
            <div className="w-3 h-3 rotate-45 border border-accent" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
