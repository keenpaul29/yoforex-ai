"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  imageUrl?: string
  url: string
  category: 'market' | 'forex' | 'stocks' | 'crypto' | 'economy'
  sentiment: 'positive' | 'negative' | 'neutral'
}

export function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'market', name: 'Market' },
    { id: 'forex', name: 'Forex' },
    { id: 'economy', name: 'Economy' },
    { id: 'crypto', name: 'Crypto' },
  ]

  // Simulate fetching news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        const mockArticles: NewsArticle[] = [
          {
            id: '1',
            title: 'Fed Signals Potential Rate Cuts in 2024',
            summary: 'The Federal Reserve has indicated possible interest rate cuts next year as inflation shows signs of cooling.',
            source: 'Bloomberg',
            publishedAt: '2024-01-15T14:30:00Z',
            url: '#',
            category: 'economy',
            sentiment: 'positive',
            imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60'
          },
          {
            id: '2',
            title: 'EUR/USD Hits 3-Month High on Dovish Fed Comments',
            summary: 'The euro strengthened against the US dollar following comments from Fed officials suggesting a more accommodative policy stance.',
            source: 'Reuters',
            publishedAt: '2024-01-14T09:15:00Z',
            url: '#',
            category: 'forex',
            sentiment: 'positive',
            imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60'
          },
          {
            id: '3',
            title: 'Bitcoin Surges Past $45,000 Amid ETF Approval Speculation',
            summary: 'Cryptocurrency markets rally as institutional interest grows and ETF approval appears imminent.',
            source: 'CoinDesk',
            publishedAt: '2024-01-13T16:45:00Z',
            url: '#',
            category: 'crypto',
            sentiment: 'positive',
            imageUrl: 'https://images.unsplash.com/photo-1622632166997-ffbb938afc97?w=800&auto=format&fit=crop&q=60'
          },
          {
            id: '4',
            title: 'US Jobs Report Exceeds Expectations',
            summary: 'The US economy added 250,000 jobs in December, surpassing analyst estimates of 180,000.',
            source: 'CNBC',
            publishedAt: '2024-01-12T08:30:00Z',
            url: '#',
            category: 'economy',
            sentiment: 'positive',
            imageUrl: 'https://images.unsplash.com/photo-1454165804606-c884d8b5d98c?w=800&auto=format&fit=crop&q=60'
          },
          {
            id: '5',
            title: 'Bank of England Holds Interest Rates Steady',
            summary: 'The Bank of England maintained its benchmark interest rate at 5.25% as inflation remains stubbornly high.',
            source: 'Financial Times',
            publishedAt: '2024-01-11T12:15:00Z',
            url: '#',
            category: 'economy',
            sentiment: 'neutral',
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60'
          },
          {
            id: '6',
            title: 'Gold Prices Drop as Dollar Strengthens',
            summary: 'Gold fell to a one-month low as the US dollar gained strength against major currencies.',
            source: 'Kitco',
            publishedAt: '2024-01-10T15:20:00Z',
            url: '#',
            category: 'market',
            sentiment: 'negative',
            imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60'
          },
        ]
        
        setArticles(mockArticles)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNews()
  }, [])

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  const paginatedArticles = filteredArticles.slice(0, page * pageSize)
  const hasMore = paginatedArticles.length < filteredArticles.length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => (
              <Card key={article.id} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                {article.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${getSentimentColor(article.sentiment)}`}
                    >
                      {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{article.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {article.summary}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="outline" size="sm" className="w-full">
                    Read More
                    <Icons.arrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
              >
                <Icons.loader2 className="h-4 w-4 mr-2 animate-spin" />
                Load More
              </Button>
            </div>
          )}

          {paginatedArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icons.newspaper className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mt-2">
                Try selecting a different category or check back later for updates.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
