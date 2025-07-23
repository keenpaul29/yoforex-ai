'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
      title: "Advanced Analytics",
      description: "Powerful tools to analyze market trends and make informed trading decisions."
    },
    {
      icon: <Clock className="h-6 w-6 text-green-400" />,
      title: "Real-time Data",
      description: "Stay updated with live market data and instant trade execution."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-yellow-400" />,
      title: "Performance Tracking",
      description: "Monitor your trading performance with detailed statistics and reports."
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-400" />,
      title: "Secure Platform",
      description: "Your data and transactions are protected with enterprise-grade security."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              YoForex AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => router.push('/signIn')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push('/signUp')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="min-h-[calc(100vh-73px)]">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Advanced Trading with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Make smarter trading decisions with real-time market analysis, AI-powered signals, and professional trading tools all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <Button 
                onClick={() => router.push('/signIn')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/signUp')} 
                variant="outline"
                className="border-slate-700 hover:bg-slate-800/50 text-foreground hover:text-white px-8 py-6 text-lg h-auto"
              >
                Create Account
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              Powerful Features for <span className="text-blue-400">Smart Trading</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "bg-card/50 border border-border/50 hover:border-blue-500/30 transition-all",
                    "hover:shadow-lg hover:shadow-blue-500/10"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/10">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative mt-24 mb-16 py-16 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/5 to-blue-600/5" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full -z-10" />
            
            <div className="container mx-auto px-4 text-center relative">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Ready to Transform Your Trading?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of traders who trust our platform for their trading needs. Start your journey today with a free account.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    onClick={() => router.push('/signUp')} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto"
                  >
                    Get Started for Free
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800/50 text-foreground hover:text-white px-8 py-6 text-lg h-auto"
                    onClick={() => router.push('/signIn')}
                  >
                    Sign In to Your Account
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-8 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    YoForex AI
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} YoForex AI. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
