import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-skeleton";
import { AuthAwareLink } from "@/components/AuthAwareLink";
import heroImage from "@/assets/hero-training.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 lg:pt-0 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithSkeleton
          src={heroImage}
          alt="CODEMANDE training session"
          className="w-full h-full object-cover object-center"
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Circuit decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full fill-none stroke-accent/30"
        >
          <path
            d="M0,100 L200,100 L220,80 L400,80 L420,100 L600,100"
            strokeWidth="1"
          />
          <circle cx="220" cy="80" r="3" className="fill-accent" />
          <circle cx="420" cy="100" r="3" className="fill-accent" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6">
              Empowering Africa
              <br />
              <span className="text-foreground">Through Technology</span>
              <span className="italic text-accent ml-2">&</span>{" "}
              <span className="italic">Innovation</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
          >
            Building skills. Creating opportunities. Delivering real-world solutions through expert training and mentorship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <AuthAwareLink variant="gold" size="lg">
              Explore Programs
            </AuthAwareLink>
            <AuthAwareLink variant="heroOutline" size="lg">
              Get Started
            </AuthAwareLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
