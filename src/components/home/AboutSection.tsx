import { motion } from "framer-motion";
import { Target, Lightbulb } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-accent" />
            <h2 className="font-heading text-3xl lg:text-4xl font-medium text-foreground text-center">
              About CODEMANDE
            </h2>
            <div className="w-2 h-2 rotate-45 border border-accent" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-heading text-2xl lg:text-3xl text-foreground mb-6">
              A Center of Excellence in Technology & Skills Development
            </h3>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                CODEMANDE was founded to respond to the growing demand for skilled technology 
                professionals in Africa. We combine structured learning, hands-on practice, 
                and real project experience to prepare learners for the realities of today's 
                digital economy.
              </p>
              <p>
                We deliver training both online and in person, supported by dedicated trainers 
                who guide learners from beginner level to professional readiness.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-card rounded-lg border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <h4 className="font-heading font-semibold text-card-foreground">Our Mission</h4>
                </div>
                <p className="text-sm text-card-foreground/70">
                  To empower individuals and institutions with practical, industry-ready technology skills.
                </p>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <h4 className="font-heading font-semibold text-card-foreground">Our Vision</h4>
                </div>
                <p className="text-sm text-card-foreground/70">
                  To become a leading center of excellence in technology training and innovation in Africa.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-card shadow-card">
              <img
                src="/placeholder.svg"
                alt="CODEMANDE training center"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-accent/30 rounded-lg -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-accent/20 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
