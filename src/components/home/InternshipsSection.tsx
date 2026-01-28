import { motion } from "framer-motion";
import { Award, Briefcase, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InternshipsSection() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
            <div className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-card border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Certificates</p>
                  <p className="text-xs text-muted-foreground">All programs certified</p>
                </div>
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
            <h2 className="font-heading text-3xl lg:text-4xl font-medium text-card-foreground mb-4">
              Internships & Work Experience
            </h2>
            <h3 className="text-xl text-accent mb-6">
              Bridging Education and Employment
            </h3>
            
            <div className="space-y-4 text-card-foreground/80 mb-8">
              <p>
                CODEMANDE provides structured internship opportunities where learners work on 
                real projects under the supervision of professional trainers. These internships 
                help students apply their skills, build portfolios, and gain confidence in 
                real work environments.
              </p>
              <p>
                Our training and internship programs are separate — you can apply for either 
                or both. All programs are online-based and include project work and certification.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-accent mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="font-medium text-card-foreground text-sm">Real Projects</h4>
                  <p className="text-xs text-card-foreground/60">Work on industry-level projects</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FolderOpen className="w-5 h-5 text-accent mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="font-medium text-card-foreground text-sm">Build Portfolio</h4>
                  <p className="text-xs text-card-foreground/60">Showcase your work to employers</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold">Apply for Internship</Button>
              <Button variant="heroOutline" className="bg-transparent text-card-foreground border-card-foreground/30 hover:border-accent hover:text-accent">
                Apply for Training
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
