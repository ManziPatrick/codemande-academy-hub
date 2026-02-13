import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-skeleton";
import { AuthAwareLink } from "@/components/AuthAwareLink";
import heroImage from "@/assets/hero-training.webp";
import heroImageMobile from "@/assets/hero-training-mobile.webp";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 lg:pt-0 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithSkeleton
          src={heroImage}
          srcSet={`${heroImageMobile} 600w, ${heroImage} 1920w`}
          sizes="(max-width: 600px) 100vw, 100vw"
          alt="CODEMANDE training session"
          loading="eager"
          fetchPriority="high"
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
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Unique Highlight Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 backdrop-blur-md mb-6 sm:mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent">
                Africa's Premier Tech Center
              </span>
            </motion.div>

            <h1 className="font-heading text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] mb-5 sm:mb-8 text-center lg:text-left">
              Empowering Africa
              <br />
              <span className="text-foreground">Through </span>
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-gold">Technology</span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-1 left-0 h-4 bg-accent/20 -rotate-1 z-0"
                />
              </span>
              <br className="sm:hidden" />
              <span className="italic text-accent ml-1 sm:ml-3">&</span>{" "}
              <span className="italic font-light">Innovation</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-sm sm:text-xl text-muted-foreground/90 mb-8 sm:mb-12 max-w-xl leading-relaxed font-light"
            >
              Building high-impact skills. Creating limitless opportunities. Delivering real-world solutions through expert mentorship and hands-on practice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start w-full sm:w-auto pb-12 sm:pb-0"
            >
              <AuthAwareLink variant="gold" size="xl" className="w-full sm:w-auto shadow-premium hover:-translate-y-1 h-12 sm:h-14">
                Explore Programs
              </AuthAwareLink>
              <AuthAwareLink variant="heroOutline" size="xl" className="w-full sm:w-auto hover:bg-white/5 backdrop-blur-sm border-2 h-12 sm:h-14">
                Get Started
              </AuthAwareLink>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
