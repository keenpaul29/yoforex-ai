from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
import logging

from services.alphavantage_service import (
    get_quotes as fetch_quotes,
    get_supported_pairs,
    CurrencyPairType,
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Models
class Quote(BaseModel):
    """Market quote for a currency pair."""
    pair: str = Field(..., description="Currency pair symbol (e.g., 'EURUSD')")
    price: float = Field(..., description="Current price")
    change: float = Field(..., description="Price change from previous close")
    change_pct: float = Field(..., alias="changePercent", description="Percentage change from previous close")
    high: float = Field(..., description="Daily high price")
    low: float = Field(..., description="Daily low price")
    open: float = Field(..., description="Daily open price")
    previous_close: float = Field(..., alias="previousClose", description="Previous day's close price")
    timestamp: datetime = Field(..., description="Last updated timestamp")
    volume: Optional[float] = Field(None, description="Trading volume")
    bid: Optional[float] = Field(None, description="Current bid price")
    ask: Optional[float] = Field(None, description="Current ask price")
    spread: Optional[float] = Field(None, description="Current spread (ask - bid)")
    pip_value: Optional[float] = Field(None, alias="pipValue", description="Value of 1 pip in quote currency")
    type: str = Field(..., description="Type of instrument (forex, crypto, precious_metal)")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
        allow_population_by_field_name = True

class PairInfo(BaseModel):
    """Information about a supported currency pair."""
    name: str = Field(..., description="Display name of the pair")
    type: str = Field(..., description="Type of instrument (forex, crypto, precious_metal)")
    base: str = Field(..., description="Base currency code")
    quote: str = Field(..., description="Quote currency code")
    pip_decimal_places: int = Field(..., alias="pipDecimalPlaces", description="Number of decimal places for pip calculation")
    lot_size: int = Field(..., alias="lotSize", description="Standard lot size in units of base currency")

    class Config:
        allow_population_by_field_name = True

# Endpoints
@router.get("/quotes", response_model=Dict[str, Quote])
async def get_quotes(pairs: Optional[str] = None):
    """
    Get real-time quotes for currency pairs.
    
    Args:
        pairs: Comma-separated list of currency pairs (e.g., 'EURUSD,GBPUSD'). 
              If not provided, returns all supported pairs.
    
    Returns:
        Dictionary mapping pair symbols to quote data
    """
    try:
        # Parse the pairs parameter if provided
        pair_list = [p.strip().upper().replace("/", "") for p in pairs.split(",")] if pairs else None
        
        # Fetch quotes from Alpha Vantage
        quotes = fetch_quotes(pair_list)
        
        if not quotes:
            raise HTTPException(
                status_code=500,
                detail="No quote data available. Please try again later."
            )
            
        return quotes
        
    except Exception as e:
        logger.error(f"Error fetching quotes: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch market data: {str(e)}"
        )

@router.get("/pairs", response_model=Dict[str, PairInfo])
async def list_supported_pairs():
    """
    Get information about all supported currency pairs.
    
    Returns:
        Dictionary mapping pair symbols to their metadata
    """
    try:
        return get_supported_pairs()
    except Exception as e:
        logger.error(f"Error fetching supported pairs: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch supported currency pairs"
        )

class MarketEvent(BaseModel):
    """Economic calendar event."""
    symbol: str = Field(..., description="Currency or instrument symbol")
    event: str = Field(..., description="Event name/description")
    impact: str = Field(..., description="Impact level (low, medium, high)")
    time: datetime = Field(..., description="Event timestamp")
    actual: Optional[float] = Field(None, description="Actual value (if released)")
    forecast: Optional[float] = Field(None, description="Forecasted value")
    previous: Optional[float] = Field(None, description="Previous value")
    currency: str = Field(..., description="Currency code")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class MarketEventsResponse(BaseModel):
    """Response model for economic calendar events."""
    events: List[MarketEvent] = Field(..., description="List of economic events")
    last_updated: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of when data was last updated")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

@router.get("/events", response_model=MarketEventsResponse)
async def get_events(
    impact: str = "all",  # high, medium, low, or all
    currency: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
):
    """
    Get economic calendar events.
    
    Args:
        impact: Filter by impact level (high, medium, low, all)
        currency: Filter by currency code (e.g., 'USD', 'EUR')
        start_date: Start date for events (default: today)
        end_date: End date for events (default: 7 days from start_date)
    """
    try:
        # This is a placeholder implementation
        # In a real app, you would fetch this from an economic calendar API
        
        # For now, return some sample data
        sample_events = [
            {
                "symbol": "USD",
                "event": "Consumer Price Index (YoY)",
                "impact": "high",
                "time": datetime.utcnow().replace(hour=12, minute=30, second=0, microsecond=0),
                "actual": 3.7,
                "forecast": 3.6,
                "previous": 3.5,
                "currency": "USD"
            },
            {
                "symbol": "EUR",
                "event": "ECB President Lagarde Speech",
                "impact": "high",
                "time": datetime.utcnow().replace(hour=14, minute=0, second=0, microsecond=0) + timedelta(days=1),
                "currency": "EUR"
            },
            {
                "symbol": "GBP",
                "event": "Retail Sales (MoM)",
                "impact": "medium",
                "time": datetime.utcnow().replace(hour=9, minute=30, second=0, microsecond=0) + timedelta(days=2),
                "forecast": 0.3,
                "previous": 0.2,
                "currency": "GBP"
            },
        ]
        
        # Apply filters
        filtered_events = [
            MarketEvent(**event) for event in sample_events
            if (impact.lower() == "all" or event.get("impact") == impact.lower())
            and (not currency or event.get("currency") == currency.upper())
            and (not start_date or datetime.fromisoformat(str(event["time"])) >= start_date)
            and (not end_date or datetime.fromisoformat(str(event["time"])) <= end_date)
        ]
        
        return MarketEventsResponse(events=filtered_events)
        
    except Exception as e:
        logger.error(f"Error fetching economic events: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch economic calendar events"
        )
