import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Enroll",
    description: "Choose and enroll in a structured training program",
  },
  {
    number: "02",
    title: "Learn",
    description: "Attend guided online or in-person sessions",
  },
  {
    number: "03",
    title: "Practice",
    description: "Receive continuous mentorship and follow-up",
  },
  {
    number: "04",
    title: "Build",
    description: "Work on real-world projects",
  },
  {
    number: "05",
    title: "Experience",
    description: "Join internship (stage) programs",
  },
  {
    number: "06",
    title: "Graduate",
    description: "Earn your certificate with practical skills",
  },
];

export function TrainingProcess() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-accent" />
            <h2 className="font-heading text-3xl lg:text-4xl font-medium text-foreground text-center">
              How Our Training Works
            </h2>
            <div className="w-2 h-2 rotate-45 border border-accent" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          From Learning to Industry — Your journey with CODEMANDE
        </motion.p>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center group"
              >
                {/* Number Circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-full bg-card border-2 border-accent/50 flex items-center justify-center group-hover:border-accent group-hover:shadow-gold-glow transition-all duration-300">
                  <span className="font-heading text-xl font-bold text-accent">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
