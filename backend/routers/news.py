from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import random
from services.finnhub_service import finnhub_client

router = APIRouter()

class NewsArticle(BaseModel):
    headline: str
    summary: str
    url: str
    time: str
    source: str
    sentiment: str = "neutral"  # positive, negative, neutral

class Insight(BaseModel):
    message: str
    impact: str 
    source: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class RiskReminder(BaseModel):
    message: str
    impact: str  # high, medium, low
    symbol: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class MarketEvent(BaseModel):
    event: str
    time: str
    impact: str
    symbol: Optional[str] = None
    url: Optional[str] = None

class TradingNewsResponse(BaseModel):
    daily_insight: Insight
    risk_reminder: RiskReminder
    market_events: List[MarketEvent]
    top_news: List[NewsArticle] = []

@router.get("/", response_model=TradingNewsResponse)
async def get_trading_news():
    try:
        # Try to fetch from FinnHub with timeout, fallback to mock data if it fails
        market_news = []
        try:
            import asyncio
            market_news = await asyncio.wait_for(
                finnhub_client.get_market_news(),
                timeout=5.0
            )
        except Exception as e:
            print(f"Finnhub API failed: {e}. Using fallback data.")
            market_news = []

        # Use real data if available, otherwise use fallback
        if market_news and len(market_news) > 0:
            # Process real news articles
            top_news = []
            for article in market_news[:3]:
                top_news.append(NewsArticle(
                    headline=article.get('headline', 'No headline'),
                    summary=article.get('summary', 'No summary available'),
                    url=article.get('url', '#'),
                    time=datetime.fromtimestamp(article.get('datetime', 0)).strftime('%Y-%m-%d %H:%M:%S'),
                    source=article.get('source', 'Unknown'),
                    sentiment=random.choice(['positive', 'neutral', 'negative'])
                ))

            # Create market events from real news
            market_events = []
            for event in market_news[:2]:
                market_events.append(MarketEvent(
                    event=event.get('headline', 'Market Event'),
                    time=datetime.fromtimestamp(event.get('datetime', 0)).strftime('%Y-%m-%d %H:%M'),
                    impact=random.choice(['high', 'medium', 'low']),
                    url=event.get('url', '#')
                ))

            # Create insight from latest news
            latest_news = market_news[0]
            daily_insight = Insight(
                message=f"{latest_news.get('headline', 'Market update available')}",
                impact=random.choice(['positive', 'neutral', 'high']),
                source=latest_news.get('source', 'Market Data')
            )
        else:
            # Fallback to mock data
            top_news = [
                NewsArticle(
                    headline="EUR/USD Consolidates Near Key Support",
                    summary="The EUR/USD pair is trading near 1.0850 support level as markets await ECB decision.",
                    url="#",
                    time=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    source="Market Analysis",
                    sentiment="neutral"
                ),
                NewsArticle(
                    headline="GBP/USD Faces Resistance at 1.2750",
                    summary="Sterling struggles against the dollar amid UK economic uncertainty.",
                    url="#",
                    time=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    source="FX News",
                    sentiment="negative"
                ),
                NewsArticle(
                    headline="USD/JPY Tests 150 Level",
                    summary="The yen weakens as BoJ maintains dovish stance while Fed remains hawkish.",
                    url="#",
                    time=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    source="Currency Watch",
                    sentiment="positive"
                )
            ]

            market_events = [
                MarketEvent(
                    event="ECB Interest Rate Decision",
                    time=datetime.now().strftime('%Y-%m-%d %H:%M'),
                    impact="high",
                    url="#"
                ),
                MarketEvent(
                    event="US Employment Data Release",
                    time=datetime.now().strftime('%Y-%m-%d %H:%M'),
                    impact="medium",
                    url="#"
                )
            ]

            daily_insight = Insight(
                message="The forex market is showing mixed signals today. EUR/USD is consolidating around key support levels while GBP/USD faces resistance.",
                impact="medium",
                source="Market Analysis"
            )

        # Create risk reminder
        risk_reminder = RiskReminder(
            message="Remember to always use proper risk management. Never risk more than 2% of your account on a single trade.",
            impact="high",
            symbol="RISK"
        )

        return {
            "daily_insight": daily_insight,
            "risk_reminder": risk_reminder,
            "market_events": market_events,
            "top_news": top_news
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market data: {str(e)}")