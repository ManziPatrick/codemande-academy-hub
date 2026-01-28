import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import testimonialSarah from "@/assets/testimonial-sarah.jpg";

const testimonials = [
  {
    id: 1,
    quote: "CODEMANDE helped me transition from learning to real-world development. The mentorship prepared me for industry work.",
    author: "Emmanuel R.",
    role: "Software Developer",
    image: testimonialSarah,
  },
  {
    id: 2,
    quote: "The Data Science program gave me practical skills I use every day. Online classes were flexible with world-class instructors.",
    author: "Marie Claire M.",
    role: "Data Analyst",
    image: testimonialSarah,
  },
  {
    id: 3,
    quote: "From training to internship to full-time employment, CODEMANDE's network opened doors I never knew existed.",
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
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/50" />
          <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground text-center">
            Success Stories
          </h2>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/50" />
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Prev Button */}
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300 flex-shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Testimonial Content */}
            <div className="flex-1 relative min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-background rounded-lg p-5 shadow-card"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="w-5 h-5 text-accent flex-shrink-0 transform rotate-180" />
                    <p className="text-foreground leading-relaxed font-heading italic text-sm">
                      {currentTestimonial.quote}
                    </p>
                    <Quote className="w-5 h-5 text-accent flex-shrink-0 self-end" />
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <span className="text-accent">—</span>
                    <span className="font-semibold text-foreground text-sm">
                      {currentTestimonial.author},
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {currentTestimonial.role}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300 flex-shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
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
