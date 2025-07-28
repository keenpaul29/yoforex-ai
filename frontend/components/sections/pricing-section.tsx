"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Headphones
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for beginners getting started with AI trading",
    price: { monthly: 29, yearly: 290 },
    popular: false,
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    features: [
      { name: "Basic AI Trading Signals", included: true },
      { name: "5 Currency Pairs", included: true },
      { name: "Real-time Market Data", included: true },
      { name: "Mobile App Access", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "Custom Strategies", included: false },
      { name: "Priority Support", included: false },
      { name: "API Access", included: false },
    ],
    cta: "Start Free Trial",
    benefits: [
      "Perfect for beginners",
      "Risk-free 14-day trial",
      "Easy setup in minutes"
    ]
  },
  {
    name: "Professional",
    description: "Advanced features for serious traders and professionals",
    price: { monthly: 99, yearly: 990 },
    popular: true,
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      { name: "Advanced AI Trading Signals", included: true },
      { name: "50+ Currency Pairs", included: true },
      { name: "Real-time Market Data", included: true },
      { name: "Mobile App Access", included: true },
      { name: "Priority Support", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Custom Strategies", included: true },
      { name: "Portfolio Management", included: true },
      { name: "API Access", included: false },
    ],
    cta: "Get Started",
    benefits: [
      "Most popular choice",
      "Advanced AI algorithms",
      "Professional tools"
    ]
  },
  {
    name: "Enterprise",
    description: "Complete solution for institutions and high-volume traders",
    price: { monthly: 299, yearly: 2990 },
    popular: false,
    icon: Sparkles,
    color: "from-yellow-500 to-orange-500",
    features: [
      { name: "Premium AI Trading Signals", included: true },
      { name: "Unlimited Currency Pairs", included: true },
      { name: "Real-time Market Data", included: true },
      { name: "Mobile App Access", included: true },
      { name: "24/7 Phone Support", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Custom Strategies", included: true },
      { name: "Portfolio Management", included: true },
      { name: "Full API Access", included: true },
    ],
    cta: "Contact Sales",
    benefits: [
      "Institutional grade",
      "Dedicated account manager",
      "Custom integrations"
    ]
  }
];

const additionalFeatures = [
  { name: "99.9% Uptime Guarantee", icon: Shield },
  { name: "Bank-Level Security", icon: Shield },
  { name: "24/7 Customer Support", icon: Headphones },
  { name: "Mobile & Desktop Apps", icon: Zap },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={ref} id="pricing" className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="text-gradient">Trading Plan</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start with our free trial and upgrade as you grow. All plans include our core AI trading features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                isYearly ? 'bg-primary' : 'bg-muted'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: isYearly ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium"
              >
                Save 20%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`relative rounded-3xl p-8 border transition-all duration-300 hover-lift ${
                plan.popular
                  ? "border-primary/50 bg-primary/5 shadow-xl scale-105"
                  : "border-border/20 bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.color} shadow-lg mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ${Math.round(plan.price.yearly / 12)}/month billed annually
                    </div>
                  )}
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "gradient-primary hover-glow" 
                      : "variant-outline hover:bg-primary/10"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3">Features:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-8">All Plans Include</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="flex flex-col items-center text-center p-6 glass rounded-2xl border border-primary/20"
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <span className="font-medium">{feature.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
