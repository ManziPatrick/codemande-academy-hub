import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import testimonialSarah from "@/assets/testimonial-sarah.jpg";

const testimonials = [
  {
    id: 1,
    quote:
      "CODEMANDE helped me transition from learning to real-world development. The mentorship and projects prepared me for industry work.",
    author: "Emmanuel R.",
    role: "Software Developer",
    image: testimonialSarah,
  },
  {
    id: 2,
    quote:
      "The Data Science program gave me practical skills that I use every day. The online classes were flexible and the instructors are truly world-class.",
    author: "Marie Claire M.",
    role: "Data Analyst",
    image: testimonialSarah,
  },
  {
    id: 3,
    quote:
      "From training to internship to full-time employment, CODEMANDE's network opened doors I never knew existed. The certificate helped my career.",
    author: "Jean Paul N.",
    role: "IoT Engineer",
    image: testimonialSarah,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45 border border-accent" />
            <h2 className="font-heading text-3xl lg:text-4xl font-medium text-foreground text-center">
              Success Stories
            </h2>
            <div className="w-2 h-2 rotate-45 border border-accent" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        <p className="text-center text-muted-foreground mb-12 font-heading italic">
          Transforming Careers Across Africa
        </p>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Prev Button */}
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300 flex-shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Testimonial Content */}
            <div className="flex-1 relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-background rounded-lg p-6 lg:p-8 shadow-card"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Quote */}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-4">
                        <Quote className="w-6 h-6 text-accent flex-shrink-0 transform rotate-180" />
                        <p className="text-foreground text-lg lg:text-xl leading-relaxed font-heading italic">
                          {currentTestimonial.quote}
                        </p>
                        <Quote className="w-6 h-6 text-accent flex-shrink-0 self-end" />
                      </div>
                      <div className="flex items-center gap-2 ml-8">
                        <span className="text-accent">—</span>
                        <span className="font-semibold text-foreground">
                          {currentTestimonial.author},
                        </span>
                        <span className="text-muted-foreground">
                          {currentTestimonial.role}
                        </span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-accent/30 flex-shrink-0">
                      <img
                        src={currentTestimonial.image}
                        alt={currentTestimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300 flex-shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-accent w-6"
                    : "bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
