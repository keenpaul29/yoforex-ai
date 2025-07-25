# services/oanda_service.py

import os
from dotenv import load_dotenv
from datetime import datetime
from oandapyV20 import API
from oandapyV20.endpoints.instruments import InstrumentsCandles

# Load environment variables
load_dotenv()
OANDA_API_KEY = os.getenv("OANDA_API_KEY")
OANDA_ACCOUNT_ID = os.getenv("OANDA_ACCOUNT_ID")
if not OANDA_API_KEY or not OANDA_ACCOUNT_ID:
    raise RuntimeError("OANDA_API_KEY and OANDA_ACCOUNT_ID must be set in .env")

# Initialize OANDA v20 client
api = API(access_token=OANDA_API_KEY)


def _parse_oanda_time(ts_str: str) -> datetime:
    """
    Parse OANDA timestamp with nanosecond precision into Python datetime.
    Example input: '2025-07-24T08:55:00.000000000Z'
    """
    # Replace trailing Z with UTC offset
    if ts_str.endswith("Z"):
        ts_str = ts_str[:-1] + "+00:00"
    # Truncate fractional seconds to microseconds (6 digits)
    if "." in ts_str:
        date_part, frac_tz = ts_str.split('.', 1)
        frac, tz = frac_tz.split('+') if '+' in frac_tz else frac_tz.split('-')
        tz_sign = '+' if '+' in frac_tz else '-'
        micro = (frac[:6]).ljust(6, '0')
        ts_str = f"{date_part}.{micro}{tz_sign}{tz}"
    return datetime.fromisoformat(ts_str)


def get_oanda_ohlcv(pair: str = "EUR_USD", granularity: str = "M5", count: int = 50) -> list:
    """
    Fetch the last `count` candles for `pair` with given `granularity` from OANDA.
    - pair: e.g. 'EUR_USD', 'XAU_USD'
    - granularity: 'M1','M5','H1','D', etc.
    Returns list of candles with keys: time, open, high, low, close, volume.
    """
    params = {"granularity": granularity, "count": count, "price": "M"}
    request = InstrumentsCandles(instrument=pair, params=params)
    try:
        response = api.request(request)
    except Exception as e:
        print(f"[get_oanda_ohlcv] API request error: {e}")
        return []

    candles = []
    for c in response.get("candles", []):
        if not c.get("complete"):
            continue
        dt = _parse_oanda_time(c["time"])
        mid = c.get("mid", {})
        candles.append({
            "time": dt.strftime("%Y-%m-%d %H:%M"),
            "open": float(mid.get("o", 0)),
            "high": float(mid.get("h", 0)),
            "low": float(mid.get("l", 0)),
            "close": float(mid.get("c", 0)),
            "volume": c.get("volume", 0),
        })
    return candles
