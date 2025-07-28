"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Globe
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Professional Trader",
    company: "Goldman Sachs",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "YoForex AI has completely transformed my trading strategy. The AI predictions are incredibly accurate, and I've seen a 340% increase in my portfolio performance.",
    stats: { profit: "+340%", timeframe: "6 months" },
    location: "New York, USA"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Hedge Fund Manager",
    company: "Quantum Capital",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "The advanced analytics and real-time insights have given us a significant edge in the market. Our fund has outperformed benchmarks consistently.",
    stats: { profit: "+280%", timeframe: "1 year" },
    location: "London, UK"
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    role: "Forex Specialist",
    company: "Tokyo Financial",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "The automated trading features work flawlessly even during volatile market conditions. I can trade confidently 24/7 without constant monitoring.",
    stats: { profit: "+425%", timeframe: "8 months" },
    location: "Tokyo, Japan"
  },
  {
    id: 4,
    name: "Emma Thompson",
    role: "Investment Advisor",
    company: "Swiss Bank",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "The risk management tools are exceptional. We've minimized losses while maximizing gains across all our client portfolios.",
    stats: { profit: "+195%", timeframe: "4 months" },
    location: "Zurich, Switzerland"
  },
  {
    id: 5,
    name: "Ahmed Hassan",
    role: "Trading Director",
    company: "Emirates Trading",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "YoForex AI's machine learning algorithms adapt to market changes faster than any human trader. It's like having a crystal ball for forex markets.",
    stats: { profit: "+520%", timeframe: "10 months" },
    location: "Dubai, UAE"
  },
  {
    id: 6,
    name: "Isabella Santos",
    role: "Portfolio Manager",
    company: "Brazilian Investment",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "The platform's intuitive interface combined with powerful AI makes complex trading strategies accessible to everyone on our team.",
    stats: { profit: "+310%", timeframe: "7 months" },
    location: "São Paulo, Brazil"
  }
];

const stats = [
  { value: "50K+", label: "Active Traders", icon: Users },
  { value: "94%", label: "Success Rate", icon: TrendingUp },
  { value: "15+", label: "Awards Won", icon: Award },
  { value: "120+", label: "Countries", icon: Globe },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to/10 rounded-full blur-3xl animate-float-slow" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            <span>Trusted by Professionals</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            What Our <span className="text-gradient">Traders Say</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of successful traders who have transformed their trading with our AI-powered platform.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="text-center group"
            >
              <div className="glass rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="glass-strong rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center justify-center mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-xl md:text-2xl text-center mb-8 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  {/* Stats */}
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">
                        {testimonials[currentIndex].stats.profit}
                      </div>
                      <div className="text-sm text-muted-foreground">Profit Increase</div>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">
                        {testimonials[currentIndex].stats.timeframe}
                      </div>
                      <div className="text-sm text-muted-foreground">Time Frame</div>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{testimonials[currentIndex].name}</div>
                      <div className="text-muted-foreground">
                        {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                      </div>
                      <div className="text-sm text-primary">{testimonials[currentIndex].location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="glass border-primary/30 hover:border-primary/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="glass border-primary/30 hover:border-primary/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Join Them?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey to trading success with our AI-powered platform. Join thousands of traders who trust YoForex AI.
          </p>
          <Button size="lg" className="gradient-primary hover-lift">
            Start Your Free Trial
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
