from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from datetime import datetime
import random
from services.finnhub_service import finnhub_client

router = APIRouter(prefix="/news")

class NewsArticle(BaseModel):
    headline: str
    summary: str
    url: str
    time: str
    source: str
    sentiment: str = "neutral"  # positive, negative, neutral

@router.get("/", response_model=List[NewsArticle])
async def get_trading_news(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(5, ge=1, le=50, description="Articles per page")
):
    # Fetch up to 50 combined news items
    market_news = await finnhub_client.get_market_news(limit=50)
    if not market_news:
        raise HTTPException(status_code=502, detail="No news received from provider")

    # Pagination
    start = (page - 1) * limit
    end = start + limit
    page_slice = market_news[start:end]
    if not page_slice:
        raise HTTPException(status_code=404, detail="Page out of range")

    # Map to Pydantic model
    result = []
    for art in page_slice:
        # some Finnhub articles give 'datetime' field, some 'time'; handle both
        ts = art.get("datetime") or art.get("time") or 0
        try:
            time_str = datetime.fromtimestamp(int(ts)).strftime("%Y-%m-%d %H:%M:%S")
        except:
            time_str = art.get("time", "")

        result.append(NewsArticle(
            headline=art.get("headline", "No headline"),
            summary=art.get("summary", "No summary available"),
            url=art.get("url", "#"),
            time=time_str,
            source=art.get("source", "Unknown"),
            sentiment=random.choice(["positive", "neutral", "negative"])
        ))

    return result
