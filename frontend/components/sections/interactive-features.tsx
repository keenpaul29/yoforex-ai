"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Brain, 
  Clock, 
  Globe, 
  Lock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Layers,
  Cpu
} from "lucide-react";

const features = [
  {
    id: "ai-trading",
    title: "AI-Powered Trading",
    description: "Advanced machine learning algorithms analyze market patterns and execute trades with superhuman precision.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    benefits: [
      "99.7% accuracy in market predictions",
      "Real-time pattern recognition",
      "Automated risk management",
      "24/7 market monitoring"
    ],
    stats: { value: "99.7%", label: "Accuracy Rate" }
  },
  {
    id: "analytics",
    title: "Advanced Analytics",
    description: "Comprehensive market analysis with interactive charts, technical indicators, and predictive modeling.",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Real-time market data",
      "50+ technical indicators",
      "Custom dashboard creation",
      "Historical backtesting"
    ],
    stats: { value: "50+", label: "Indicators" }
  },
  {
    id: "security",
    title: "Bank-Level Security",
    description: "Military-grade encryption and multi-layer security protocols protect your investments and personal data.",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    benefits: [
      "256-bit SSL encryption",
      "Multi-factor authentication",
      "Cold storage wallets",
      "Regulatory compliance"
    ],
    stats: { value: "100%", label: "Secure" }
  },
  {
    id: "performance",
    title: "High Performance",
    description: "Lightning-fast execution with sub-millisecond latency and 99.99% uptime guarantee.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    benefits: [
      "Sub-millisecond execution",
      "99.99% uptime guarantee",
      "Global server network",
      "Zero slippage trading"
    ],
    stats: { value: "<1ms", label: "Latency" }
  },
  {
    id: "automation",
    title: "Smart Automation",
    description: "Fully automated trading strategies that work around the clock to maximize your profits.",
    icon: Cpu,
    color: "from-indigo-500 to-purple-500",
    benefits: [
      "Custom strategy builder",
      "Portfolio rebalancing",
      "Stop-loss automation",
      "Profit target optimization"
    ],
    stats: { value: "24/7", label: "Active Trading" }
  },
  {
    id: "global",
    title: "Global Markets",
    description: "Access to major forex pairs, commodities, indices, and cryptocurrencies from around the world.",
    icon: Globe,
    color: "from-teal-500 to-blue-500",
    benefits: [
      "150+ currency pairs",
      "Global market access",
      "Multi-asset trading",
      "Real-time pricing"
    ],
    stats: { value: "150+", label: "Currency Pairs" }
  }
];

export function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
    <section ref={ref} className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to/10 rounded-full blur-3xl animate-float" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Cutting-Edge Features</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-gradient">Revolutionary</span> Trading Platform
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Experience the future of forex trading with our AI-powered platform that combines advanced technology with intuitive design.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Navigation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? "bg-primary/10 border-primary/30 shadow-lg"
                    : "bg-card/50 border-border/20 hover:border-primary/20"
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2"
                      >
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">
                      {feature.stats.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {feature.stats.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Showcase */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="sticky top-24"
          >
            <div className="glass-strong rounded-3xl p-8 border border-primary/20 hover-glow">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} shadow-xl mb-6`}>
                  {(() => {
                    const IconComponent = features[activeFeature].icon;
                    return <IconComponent className="w-12 h-12 text-white" />;
                  })()}
                </div>
                
                <h3 className="text-3xl font-bold mb-4 text-gradient">
                  {features[activeFeature].title}
                </h3>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {features[activeFeature].description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features[activeFeature].benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">
                    {features[activeFeature].stats.value}
                  </div>
                  <div className="text-muted-foreground mb-6">
                    {features[activeFeature].stats.label}
                  </div>
                  
                  <Button className="gradient-primary hover-lift group">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
