"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MarketOverview } from "@/components/market/market-overview"
import { NewsFeed } from "@/components/news/news-feed"
import { TradeHistory } from "@/components/trades/trade-history"
import { ForumPreview } from "@/components/forum/forum-preview"

type DashboardTab = "market" | "news" | "trades" | "forum"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("market")
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex flex-col items-center justify-center py-10 px-2">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card shadow-2xl p-8 rounded-3xl mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-3">Dashboard</h1>
              <p className="text-xl text-muted-foreground font-light">
                Your personalized trading dashboard with market data and insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-blue-400 text-blue-600 btn-animated hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Icons.settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
        <div className="glass-card shadow-xl p-6 rounded-2xl">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as DashboardTab)}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6 glass-card card-hover">
              <TabsTrigger value="market" className="btn-animated px-4 py-2 rounded-lg font-semibold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all">
                <Icons.barChart2 className="h-4 w-4 mr-2" />
                Market
              </TabsTrigger>
              <TabsTrigger value="news" className="btn-animated px-4 py-2 rounded-lg font-semibold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all">
                <Icons.newspaper className="h-4 w-4 mr-2" />
                News
              </TabsTrigger>
              <TabsTrigger value="trades" className="btn-animated px-4 py-2 rounded-lg font-semibold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all">
                <Icons.activity className="h-4 w-4 mr-2" />
                Trades
              </TabsTrigger>
              <TabsTrigger value="forum" className="btn-animated px-4 py-2 rounded-lg font-semibold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all">
                <Icons.messageSquare className="h-4 w-4 mr-2" />
                Forum
              </TabsTrigger>
            </TabsList>
            <TabsContent value="market" className="space-y-4">
              <MarketOverview />
            </TabsContent>
            <TabsContent value="news" className="space-y-4">
              <NewsFeed />
            </TabsContent>
            <TabsContent value="trades" className="space-y-4">
              <TradeHistory />
            </TabsContent>
            <TabsContent value="forum" className="space-y-4">
              <ForumPreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}        
