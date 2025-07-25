# services/alphavantage_service.py
"""
Alpha Vantage Service
Provides OHLCV data using the Free Alpha Vantage API.
1. Set ALPHAVANTAGE_API_KEY in .env
2. Install: pip install requests python-dotenv
3. Use get_ohlcv_av(symbol, resolution, count)
"""
import os
from dotenv import load_dotenv
import requests
from datetime import datetime

# Load config
def load_config():
    load_dotenv()
    key = os.getenv("ALPHAVANTAGE_API_KEY")
    if not key:
        raise RuntimeError("ALPHAVANTAGE_API_KEY not set in environment variables")
    return key

ALPHA_VANTAGE_KEY = load_config()
BASE_URL = "https://www.alphavantage.co/query"

# Supported pairs
FOREX_PAIRS = {"XAUUSD": ("XAU","USD"), "EURUSD": ("EUR","USD"), "GBPUSD": ("GBP","USD"), "USDJPY": ("USD","JPY")}
CRYPTO_PAIRS = {"BTCUSD": ("BTC","USD"), "ETHUSD": ("ETH","USD")}

# Error checker
def _is_error(data: dict) -> str:
    if "Note" in data:
        return data["Note"]
    if "Error Message" in data:
        return data["Error Message"]
    return ""

# FX intraday
def get_fx_intraday(from_sym: str, to_sym: str, interval: str = "5min", outputsize: str = "compact") -> dict:
    params = {
        "function": "FX_INTRADAY",
        "from_symbol": from_sym,
        "to_symbol": to_sym,
        "interval": interval,
        "outputsize": outputsize,
        "apikey": ALPHA_VANTAGE_KEY
    }
    resp = requests.get(BASE_URL, params=params, timeout=10)
    data = resp.json()
    print(f"[get_fx_intraday] Raw response: {data}")  # Add this line
    err = _is_error(data)
    if err:
        print(f"[get_fx_intraday] {err}")
        return {}
    return data.get(f"Time Series FX ({interval})", {})

# Crypto daily
def get_crypto_daily(symbol: str, market: str = "USD", outputsize: str = "compact") -> dict:
    params = {
        "function": "DIGITAL_CURRENCY_DAILY",
        "symbol": symbol,
        "market": market,
        "outputsize": outputsize,
        "apikey": ALPHA_VANTAGE_KEY
    }
    resp = requests.get(BASE_URL, params=params, timeout=10)
    data = resp.json()
    err = _is_error(data)
    if err:
        print(f"[get_crypto_daily] {err}")
        return {}
    return data.get("Time Series (Digital Currency Daily)", {})

# Unified OHLCV

def get_ohlcv_av(symbol: str, resolution: str = "5", count: int = 50) -> list:
    """
    Fetch OHLCV for a single symbol.
    - Forex: intraday at resolution minutes.
    - Crypto: daily only.
    Returns list of candles or None if unsupported.
    """
    sym = symbol.upper()
    candles = []
    # Forex
    if sym in FOREX_PAIRS:
        fs, ts = FOREX_PAIRS[sym]
        interval = f"{resolution}min"
        series = get_fx_intraday(fs, ts, interval)
        timestamps = sorted(series.keys(), reverse=True)[:count]
        for ts_key in timestamps:
            entry = series[ts_key]
            candles.append({
                "time": ts_key,
                "open": float(entry.get("1. open", 0)),
                "high": float(entry.get("2. high", 0)),
                "low": float(entry.get("3. low", 0)),
                "close": float(entry.get("4. close", 0)),
                "volume": None
            })
    # Crypto
    elif sym in CRYPTO_PAIRS:
        base, market = CRYPTO_PAIRS[sym]
        series = get_crypto_daily(base, market)
        timestamps = sorted(series.keys(), reverse=True)[:count]
        for ts_key in timestamps:
            entry = series[ts_key]
            # find keys
            o_key = next((k for k in entry if "open" in k and market in k), None)
            c_key = next((k for k in entry if "close" in k and market in k), None)
            h_key = next((k for k in entry if "high" in k and market in k), None)
            l_key = next((k for k in entry if "low" in k and market in k), None)
            v_key = next((k for k in entry if "volume" in k.lower()), None)
            if not all([o_key, c_key, h_key, l_key, v_key]):
                continue
            candles.append({
                "time": ts_key,
                "open": float(entry[o_key]),
                "high": float(entry[h_key]),
                "low": float(entry[l_key]),
                "close": float(entry[c_key]),
                "volume": float(entry[v_key])
            })
    else:
        print(f"[get_ohlcv_av] Unsupported symbol: {sym}")
        return None

    return candles