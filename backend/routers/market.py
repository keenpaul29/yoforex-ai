from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class Quote(BaseModel):
    pair: str
    price: float
    change_pct: float

@router.get("/quotes", response_model=List[Quote])
async def get_quotes(pairs: Optional[str] = None):
    # stubbed data – replace with real data source
    dummy = [
        Quote(pair="EUR/USD", price=1.0892, change_pct=0.05),
        Quote(pair="GBP/USD", price=1.2754, change_pct=-0.12),
        Quote(pair="USD/JPY", price=138.92, change_pct=0.23),
        Quote(pair="AUD/USD", price=0.6598, change_pct=0.08),
        Quote(pair="USD/CAD", price=1.3465, change_pct=-0.03),
    ]
    if pairs:
        wanted = {p.upper() for p in pairs.split(",")}
        return [q for q in dummy if q.pair.replace("/", "") in wanted]
    return dummy

class MarketEvent(BaseModel):
    symbol: str
    impact: str
    time: str

class UpcomingEvent(BaseModel):
    symbol: str
    in_minutes: int

class MarketEventsResponse(BaseModel):
    historic: List[MarketEvent]
    upcoming: List[UpcomingEvent]

@router.get("/events", response_model=MarketEventsResponse)
async def get_events(
    impact: Optional[str] = "all",  # high, extreme or all
    upcoming_window: Optional[int] = 120,
):
    # stubbed; wire this into your econ‐calendar service
    return MarketEventsResponse(
        historic=[
            MarketEvent(symbol="USD CPI Data", impact="High", time="14:30"),
            MarketEvent(symbol="USD FOMC Statement", impact="Extreme", time="16:00"),
            MarketEvent(symbol="GBP Employment Change", impact="High", time="08:00"),
        ],
        upcoming=[
            UpcomingEvent(symbol="USD CPI Data", in_minutes=30),
            UpcomingEvent(symbol="EUR ECB Speech", in_minutes=45),
        ],
    )

class CurrencyPair(BaseModel):
    pair: str
    price: float
    change: float
    positive: bool

@router.get("/currency-pairs", response_model=List[CurrencyPair])
async def get_currency_pairs():
    # Return currency pairs data that matches frontend expectations
    return [
        CurrencyPair(pair="EUR/USD", price=1.0892, change=0.05, positive=True),
        CurrencyPair(pair="GBP/USD", price=1.2754, change=-0.12, positive=False),
        CurrencyPair(pair="USD/JPY", price=138.92, change=0.23, positive=True),
        CurrencyPair(pair="AUD/USD", price=0.6598, change=0.08, positive=True),
        CurrencyPair(pair="USD/CAD", price=1.3465, change=-0.03, positive=False),
    ]

class PerformanceData(BaseModel):
    total_trades: int
    win_rate: float
    profit_factor: float
    total_profit: float

@router.get("/performance", response_model=PerformanceData)
async def get_performance():
    return PerformanceData(
        total_trades=47,
        win_rate=71.2,
        profit_factor=2.8,
        total_profit=1248.50
    )

class MarketStatistics(BaseModel):
    active_traders: int
    daily_volume: float
    top_pairs: List[str]

@router.get("/statistics", response_model=MarketStatistics)
async def get_market_statistics():
    return MarketStatistics(
        active_traders=1247,
        daily_volume=5.2e12,  # 5.2 trillion
        top_pairs=["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"]
    )
