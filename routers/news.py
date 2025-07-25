from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
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

@router.get("/", response_model=List[NewsArticle])
async def get_trading_news():
    try:
        market_news = await finnhub_client.get_market_news()

        if not market_news:
            raise HTTPException(status_code=502, detail="No news received from provider")

        top_news = []
        for article in market_news[:50]:  # You can change to top 3 or more
            top_news.append(NewsArticle(
                headline=article.get('headline', 'No headline'),
                summary=article.get('summary', 'No summary available'),
                url=article.get('url', '#'),
                time=datetime.fromtimestamp(article.get('datetime', 0)).strftime('%Y-%m-%d %H:%M:%S'),
                source=article.get('source', 'Unknown'),
                sentiment=random.choice(['positive', 'neutral', 'negative'])
            ))

        return top_news

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trading news: {str(e)}")
