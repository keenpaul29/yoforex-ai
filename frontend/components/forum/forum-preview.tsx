"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface ForumPost {
  id: string
  title: string
  author: {
    name: string
    avatar: string
    role: 'admin' | 'moderator' | 'member' | 'pro'
  }
  category: 'general' | 'strategies' | 'market-news' | 'trading-journal' | 'questions'
  replies: number
  views: number
  lastActivity: string
  isPinned?: boolean
  isLocked?: boolean
  tags?: string[]
}

export function ForumPreview() {
  const [activeTab, setActiveTab] = useState('recent')
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock data for forum posts
  const mockPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best Scalping Strategies for EUR/USD',
      author: {
        name: 'TraderPro',
        avatar: '',
        role: 'pro'
      },
      category: 'strategies',
      replies: 24,
      views: 1567,
      lastActivity: '2024-01-15T14:30:00Z',
      isPinned: true,
      tags: ['scalping', 'eurusd', 'trading-strategy']
    },
    {
      id: '2',
      title: 'Market Outlook: FOMC Meeting Impact on USD Pairs',
      author: {
        name: 'MarketWatcher',
        avatar: '',
        role: 'moderator'
      },
      category: 'market-news',
      replies: 42,
      views: 2890,
      lastActivity: '2024-01-15T12:15:00Z',
      tags: ['fomc', 'usd', 'fundamental-analysis']
    },
    {
      id: '3',
      title: 'Help with MT5 Expert Advisor',
      author: {
        name: 'NewTrader123',
        avatar: '',
        role: 'member'
      },
      category: 'questions',
      replies: 8,
      views: 210,
      lastActivity: '2024-01-14T18:45:00Z',
      tags: ['mt5', 'expert-advisor', 'help']
    },
    {
      id: '4',
      title: 'My January Trading Journal - Consistent Profits',
      author: {
        name: 'ConsistentTrader',
        avatar: '',
        role: 'pro'
      },
      category: 'trading-journal',
      replies: 31,
      views: 1980,
      lastActivity: '2024-01-14T09:20:00Z',
      isPinned: true,
      tags: ['trading-journal', 'profit', 'risk-management']
    },
    {
      id: '5',
      title: 'Technical Analysis: Gold (XAU/USD) Weekly Forecast',
      author: {
        name: 'GoldTrader',
        avatar: '',
        role: 'pro'
      },
      category: 'market-news',
      replies: 17,
      views: 1240,
      lastActivity: '2024-01-13T16:30:00Z',
      tags: ['gold', 'technical-analysis', 'forecast']
    },
  ]
  
  const popularPosts = [...mockPosts].sort((a, b) => b.views - a.views).slice(0, 5)
  const recentPosts = [...mockPosts].sort((a, b) => 
    new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  )
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategies':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'market-news':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'trading-journal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'questions':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="text-xs">Admin</Badge>
      case 'moderator':
        return <Badge variant="secondary" className="text-xs">Mod</Badge>
      case 'pro':
        return <Badge variant="premium" className="text-xs">PRO</Badge>
      default:
        return null
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours}h ago`
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24)
      return `${days}d ago`
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community Forum</h2>
          <p className="text-muted-foreground">
            Connect with traders, share strategies, and discuss market movements
          </p>
        </div>
        <Button>
          <Icons.plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
          <TabsTrigger value="popular">Popular Topics</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>
                            {post.author.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">
                              {post.isPinned && (
                                <Icons.pin className="inline h-3 w-3 mr-1 text-yellow-500" />
                              )}
                              {post.isLocked && (
                                <Icons.lock className="inline h-3 w-3 mr-1 text-muted-foreground" />
                              )}
                              {post.title}
                            </h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="font-medium">{post.author.name}</span>
                            {getRoleBadge(post.author.role)}
                            <span>•</span>
                            <span>{formatDate(post.lastActivity)}</span>
                            <span>•</span>
                            <Badge variant="outline" className={getCategoryColor(post.category)}>
                              {post.category.replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icons.messageSquare className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icons.eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {popularPosts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>{post.views} views</span>
                            <span>•</span>
                            <span>{post.replies} replies</span>
                            <span>•</span>
                            <span>{formatDate(post.lastActivity)}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Icons.chevronRight className="h-4 w-4" />
                          <span className="sr-only">View post</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="following" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Icons.users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No followed discussions</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Follow discussions to see them here. You can follow any discussion by clicking the follow button.
              </p>
              <Button>
                <Icons.compass className="h-4 w-4 mr-2" />
                Browse Discussions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    <Skeleton className="h-4 w-6" />
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['scalping', 'swing-trading', 'forex', 'crypto', 'technical-analysis', 'fundamentals', 'risk-management', 'trading-journal'].map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Forum Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold">24.5K</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">156K</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">8.2K</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">1.2K</div>
                <div className="text-sm text-muted-foreground">Daily Posts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
