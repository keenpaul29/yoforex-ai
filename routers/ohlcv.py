from fastapi import APIRouter
from services.oanda_service import get_oanda_ohlcv

router = APIRouter(prefix="/tools", tags=["OANDA"])

@router.get("/ohlcv/oanda")
def ohlcv_oanda(pair: str = "EUR_USD", granularity: str = "M5", count: int = 50):
    data = get_oanda_ohlcv(pair, granularity, count)
    return {"pair": pair, "granularity": granularity, "candles": data}
