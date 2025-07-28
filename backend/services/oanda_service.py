# services/oanda_service.py


# Alpha Vantage OHLCV integration (replaces OANDA)
from services.alphavantage_service import get_ohlcv_av

def get_alphavantage_ohlcv(pair: str = "EURUSD", resolution: str = "5", count: int = 50) -> list:
    """
    Fetch the last `count` candles for `pair` with given `resolution` (in minutes) from Alpha Vantage.
    - pair: e.g. 'EURUSD', 'XAUUSD', 'GBPUSD', 'USDJPY', etc.
    - resolution: '1', '5', '15', '30', '60' (minutes)
    Returns list of candles with keys: time, open, high, low, close, volume.
    """
    return get_ohlcv_av(pair, resolution=resolution, count=count) or []
