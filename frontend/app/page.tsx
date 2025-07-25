import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center glass-card shadow-2xl p-12 border border-muted/40 rounded-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-primary drop-shadow-lg">
            AI-Powered <span className="text-blue-600 dark:text-blue-400">Forex Trading</span> Analysis
          </h1>
          <p className="text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
            Leverage advanced AI to analyze forex markets, identify trading opportunities, and make data-driven decisions with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl btn-animated hover:from-blue-700 hover:to-blue-500 transition-all duration-200 rounded-xl" asChild>
              <Link href="/dashboard">
                Get Started
                <Icons.chevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-blue-400 text-blue-600 btn-animated hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl" asChild>
              <Link href="/market">
                <Icons.market className="mr-2 h-5 w-5" />
                View Markets
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-14 text-primary">Powerful Trading Tools</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Icons.chart className="h-10 w-10 mb-4 text-primary" />,
                title: "Advanced Charting",
                description: "Interactive charts with technical indicators and drawing tools for in-depth market analysis."
              },
              {
                icon: <Icons.analysis className="h-10 w-10 mb-4 text-primary" />,
                title: "AI-Powered Analysis",
                description: "Get AI-generated insights and trade signals based on market data and technical indicators."
              },
              {
                icon: <Icons.market className="h-10 w-10 mb-4 text-primary" />,
                title: "Real-time Market Data",
                description: "Access real-time forex prices, news, and economic events that impact currency markets."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm border">
                {feature.icon}
                <h3 className="text-2xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-lg text-muted-foreground font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center glass-card shadow-2xl p-10 border border-muted/40 rounded-3xl">
          <h2 className="text-4xl font-bold mb-8 text-primary">Ready to Transform Your Trading?</h2>
          <p className="text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            Join thousands of traders who trust YoForex AI for their market analysis and trading decisions.
          </p>
          <Button size="lg" className="px-10 bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl btn-animated hover:from-blue-700 hover:to-blue-500 transition-all duration-200 rounded-xl" asChild>
            <Link href="/signup">
              Start Free Trial
              <Icons.chevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
