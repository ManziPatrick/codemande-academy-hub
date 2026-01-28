import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Briefcase, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InternshipsSection() {
  return (
    <section className="py-16 lg:py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-background/10 shadow-card">
              <img
                src="/placeholder.svg"
                alt="Internship program"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-4 -right-4 bg-background rounded-lg p-3 shadow-card border border-border/50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-foreground">Certified Programs</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-heading text-2xl lg:text-3xl font-medium text-card-foreground mb-2">
              Internships & Work Experience
            </h2>
            <p className="text-accent text-sm mb-4">Bridging Education and Employment</p>
            
            <p className="text-card-foreground/80 text-sm leading-relaxed mb-6">
              Structured online internships where learners work on real projects under 
              professional supervision. Training and internship programs are separate — 
              apply for either or both. All programs include certification.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="text-sm text-card-foreground">Real Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="text-sm text-card-foreground">Build Portfolio</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/internships">
                <Button variant="gold" size="sm">Apply for Internship</Button>
              </Link>
              <Link to="/training">
                <Button variant="heroOutline" size="sm" className="bg-transparent text-card-foreground border-card-foreground/30 hover:border-accent hover:text-accent">
                  Apply for Training
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
