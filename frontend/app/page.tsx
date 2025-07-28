"use client";

import { useEffect } from "react";
import { ModernNav } from "@/components/navigation/modern-nav";
import { EnhancedHero } from "@/components/sections/enhanced-hero";
import { InteractiveFeatures } from "@/components/sections/interactive-features";
import { PricingSection } from "@/components/sections/pricing-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ModernFooter } from "@/components/sections/modern-footer";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";

export default function Home() {
  useScrollAnimations();

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Modern Navigation */}
      <ModernNav />
      
      {/* Enhanced Hero Section */}
      <EnhancedHero />
      
      {/* Interactive Features Section */}
      <InteractiveFeatures />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Modern Footer */}
      <ModernFooter />
    </div>
  );
}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container px-4 mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2 fill-primary" />
              <span>Ready to get started?</span>
            </div>
            
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 mb-6">
              Start Your Trading Journey <span className="text-primary">Today</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our community of successful traders and experience the power of AI-driven trading. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group relative overflow-hidden px-8 h-12" asChild>
                <Link href="/auth/signup" className="relative z-10 font-medium">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="group px-8 h-12" asChild>
                <Link href="#" className="flex items-center font-medium">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  </svg>
                  Watch Demo
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                  ))}
                </div>
                <span>Join 10,000+ traders</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border"></div>
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span>4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-background border-t border-border/50">
        <div className="absolute inset-0 -z-10 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent_1px,white_1px)]"></div>
        
        <div className="container px-4 mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">YoForex AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering traders with AI-driven insights and tools to navigate the forex markets with confidence.
              </p>
              <div className="flex space-x-4 pt-2">
                {['twitter', 'github', 'linkedin', 'discord'].map((social) => (
                  <Link 
                    key={social} 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.charAt(0).toUpperCase() + social.slice(1)}
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Features', href: '#features' },
                  { name: 'Pricing', href: '/pricing' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Contact', href: '/contact' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Documentation', href: '/docs' },
                  { name: 'API Reference', href: '/api' },
                  { name: 'Tutorials', href: '/tutorials' },
                  { name: 'Help Center', href: '/help' },
                  { name: 'Community', href: '/community' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Subscribe to our newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest updates, news and product offers
              </p>
              <form className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 text-sm border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-r-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} YoForex AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                href="/privacy" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
