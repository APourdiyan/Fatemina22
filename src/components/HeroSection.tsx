import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { dailyQuotes } from "@/data/content";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = dailyQuotes[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % dailyQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setQuoteIndex((i) => (i + 1) % dailyQuotes.length);
  const prev = () => setQuoteIndex((i) => (i - 1 + dailyQuotes.length) % dailyQuotes.length);

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4 lg:mx-0 lg:mt-0">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 emerald-gradient opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-16 md:px-12 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-gold-light" />
          <span className="text-sm font-medium text-gold-light tracking-wide">
            دُرّ حکمت روزانه
          </span>
          <Sparkles className="w-5 h-5 text-gold-light" />
        </motion.div>

        <div className="max-w-3xl mx-auto min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-primary-foreground mb-4">
                «{quote.text}»
              </blockquote>
              <cite className="text-sm text-gold-light not-italic">
                — {quote.source}
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={prev} className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {dailyQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === quoteIndex ? "bg-gold w-6" : "bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
          <button onClick={next} className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
