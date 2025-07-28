from fastapi import APIRouter
from services.alphavantage_service import get_ohlcv_av

router = APIRouter(prefix="/tools", tags=["AlphaVantage"])

@router.get("/ohlcv/av")
def ohlcv_av(timeframe: str = "5", count: int = 50):
    symbols = ["XAUUSD","EURUSD","GBPUSD","USDJPY","BTCUSD","ETHUSD"]
    results = {sym: get_ohlcv_av(sym, resolution=timeframe, count=count) or [] for sym in symbols}
    return {"timeframe": timeframe, "count": count, "results": results}
