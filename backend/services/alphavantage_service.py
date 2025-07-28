# services/alphavantage_service.py
"""
Alpha Vantage Service
Provides financial market data using the Free Alpha Vantage API.
1. Set ALPHAVANTAGE_API_KEY in .env
2. Install: pip install requests python-dotenv
3. Use the provided functions to fetch market data
"""
import os
from typing import Dict, List, Optional, Tuple, TypedDict, Union
from dataclasses import dataclass
from enum import Enum
from dotenv import load_dotenv
import requests
from datetime import datetime, timedelta
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Type definitions
class CurrencyPairType(str, Enum):
    FOREX = "forex"
    PRECIOUS_METAL = "precious_metal"
    CRYPTO = "crypto"

@dataclass
class CurrencyPairInfo:
    from_currency: str
    to_currency: str
    name: str
    type: CurrencyPairType
    pip_decimal_places: int = 4  # Default for most forex pairs
    lot_size: int = 100000  # Standard lot size (100,000 units of base currency)

# Load config
def load_config() -> str:
    """Load and validate Alpha Vantage API key from environment variables."""
    load_dotenv()
    key = os.getenv("ALPHAVANTAGE_API_KEY")
    if not key:
        raise RuntimeError("ALPHAVANTAGE_API_KEY not set in environment variables")
    return key

ALPHA_VANTAGE_KEY = load_config()
BASE_URL = "https://www.alphavantage.co/query"
RATE_LIMIT = 5  # Max 5 requests per minute for free tier
last_request_time = 0

# Rate limiting decorator
def rate_limited():
    """Ensure we don't exceed Alpha Vantage's rate limits."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            global last_request_time
            # Calculate time since last request
            elapsed = time.time() - last_request_time
            # Wait if needed to respect rate limit (5 requests per minute = 12 seconds between requests)
            if elapsed < 12:
                time.sleep(12 - elapsed)
            last_request_time = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Supported pairs with detailed metadata
FOREX_PAIRS = {
    "EURUSD": CurrencyPairInfo(
        from_currency="EUR",
        to_currency="USD",
        name="Euro / US Dollar",
        type=CurrencyPairType.FOREX,
        pip_decimal_places=4,
    ),
    "GBPUSD": CurrencyPairInfo(
        from_currency="GBP",
        to_currency="USD",
        name="British Pound / US Dollar",
        type=CurrencyPairType.FOREX,
        pip_decimal_places=4,
    ),
    "USDJPY": CurrencyPairInfo(
        from_currency="USD",
        to_currency="JPY",
        name="US Dollar / Japanese Yen",
        type=CurrencyPairType.FOREX,
        pip_decimal_places=2,  # JPY pairs use 2 decimal places for pips
    ),
    "AUDUSD": CurrencyPairInfo(
        from_currency="AUD",
        to_currency="USD",
        name="Australian Dollar / US Dollar",
        type=CurrencyPairType.FOREX,
    ),
    "USDCAD": CurrencyPairInfo(
        from_currency="USD",
        to_currency="CAD",
        name="US Dollar / Canadian Dollar",
        type=CurrencyPairType.FOREX,
    ),
    "USDCHF": CurrencyPairInfo(
        from_currency="USD",
        to_currency="CHF",
        name="US Dollar / Swiss Franc",
        type=CurrencyPairType.FOREX,
    ),
    "NZDUSD": CurrencyPairInfo(
        from_currency="NZD",
        to_currency="USD",
        name="New Zealand Dollar / US Dollar",
        type=CurrencyPairType.FOREX,
    ),
}

PRECIOUS_METALS = {
    "XAUUSD": CurrencyPairInfo(
        from_currency="XAU",
        to_currency="USD",
        name="Gold / US Dollar",
        type=CurrencyPairType.PRECIOUS_METAL,
        pip_decimal_places=2,
    ),
    "XAGUSD": CurrencyPairInfo(
        from_currency="XAG",
        to_currency="USD",
        name="Silver / US Dollar",
        type=CurrencyPairType.PRECIOUS_METAL,
        pip_decimal_places=3,
    ),
}

CRYPTO_PAIRS = {
    "BTCUSD": CurrencyPairInfo(
        from_currency="BTC",
        to_currency="USD",
        name="Bitcoin / US Dollar",
        type=CurrencyPairType.CRYPTO,
        pip_decimal_places=2,
    ),
    "ETHUSD": CurrencyPairInfo(
        from_currency="ETH",
        to_currency="USD",
        name="Ethereum / US Dollar",
        type=CurrencyPairType.CRYPTO,
        pip_decimal_places=2,
    ),
}

# Combine all supported pairs
ALL_PAIRS = {**FOREX_PAIRS, **PRECIOUS_METALS, **CRYPTO_PAIRS}

# Cache for storing recent quotes to reduce API calls
_quote_cache: Dict[str, Dict] = {}
_quote_cache_ttl = 30  # seconds to cache quotes

class MarketQuote(TypedDict):
    """Typed dictionary for market quote data."""
    symbol: str
    price: float
    change: float
    change_percent: float
    high: float
    low: float
    open: float
    previous_close: float
    timestamp: str
    volume: Optional[float]
    bid: Optional[float]
    ask: Optional[float]
    spread: Optional[float]
    pip_value: Optional[float]
    pip_decimal_places: int
    type: CurrencyPairType


def _is_error(data: dict) -> str:
    """Check if the API response contains an error message."""
    if not data:
        return "Empty response from API"
    if "Note" in data:
        return str(data["Note"])
    if "Error Message" in data:
        return str(data["Error Message"])
    if "Information" in data:
        return str(data["Information"])
    return ""


def _calculate_pip_value(price: float, pip_decimal_places: int = 4) -> float:
    """Calculate the value of 1 pip for the given price and decimal places."""
    return 1 / (10 ** pip_decimal_places)

@rate_limited()
def get_fx_quote(from_currency: str, to_currency: str) -> Optional[MarketQuote]:
    """Fetch real-time forex quote from Alpha Vantage.
    
    Args:
        from_currency: Base currency code (e.g., 'EUR')
        to_currency: Quote currency code (e.g., 'USD')
        
    Returns:
        MarketQuote with current price and related data, or None on error
    """
    # Check cache first
    cache_key = f"{from_currency}{to_currency}"
    cached = _quote_cache.get(cache_key, {})
    if cached and (datetime.utcnow() - cached.get('timestamp', datetime.min)).total_seconds() < _quote_cache_ttl:
        return cached['data']
    
    params = {
        "function": "CURRENCY_EXCHANGE_RATE",
        "from_currency": from_currency,
        "to_currency": to_currency,
        "apikey": ALPHA_VANTAGE_KEY
    }
    
    try:
        resp = requests.get(BASE_URL, params=params, timeout=10)
        data = resp.json()
        
        err = _is_error(data)
        if err:
            logger.error(f"Error fetching FX quote for {from_currency}{to_currency}: {err}")
            return None
            
        rate_data = data.get("Realtime Currency Exchange Rate", {})
        if not rate_data:
            logger.error(f"No rate data in response for {from_currency}{to_currency}")
            return None
            
        # Get pair info for pip calculation
        pair_info = ALL_PAIRS.get(f"{from_currency}{to_currency}")
        pip_dp = pair_info.pip_decimal_places if pair_info else 4
        
        # Calculate change from previous close
        current_price = float(rate_data.get("5. Exchange Rate", 0))
        previous_close = float(rate_data.get("8. Previous Close", current_price))
        change = current_price - previous_close
        change_pct = (change / previous_close * 100) if previous_close else 0
        
        # Create market quote
        quote: MarketQuote = {
            "symbol": f"{from_currency}{to_currency}",
            "price": current_price,
            "change": change,
            "change_percent": change_pct,
            "high": float(rate_data.get("9. Change", 0) or 0) + current_price,
            "low": current_price - float(rate_data.get("9. Change", 0) or 0),
            "open": previous_close,
            "previous_close": previous_close,
            "timestamp": rate_data.get("6. Last Refreshed", ""),
            "volume": float(rate_data.get("10. Volume", 0) or 0),
            "bid": float(rate_data.get("8. Bid Price", 0) or 0),
            "ask": float(rate_data.get("9. Ask Price", 0) or 0),
            "spread": 0,  # Will be calculated below
            "pip_value": _calculate_pip_value(current_price, pip_dp),
            "pip_decimal_places": pip_dp,
            "type": pair_info.type if pair_info else CurrencyPairType.FOREX,
        }
        
        # Calculate spread if we have both bid and ask
        if quote["bid"] and quote["ask"]:
            quote["spread"] = quote["ask"] - quote["bid"]
        
        # Update cache
        _quote_cache[cache_key] = {
            'data': quote,
            'timestamp': datetime.utcnow()
        }
        
        return quote
        
    except Exception as e:
        logger.error(f"Exception fetching FX quote for {from_currency}{to_currency}: {str(e)}")
        return None


@rate_limited()
def get_fx_intraday(from_sym: str, to_sym: str, interval: str = "5min", outputsize: str = "compact") -> dict:
    """Fetch intraday forex data from Alpha Vantage.
    
    Args:
        from_sym: From currency symbol (e.g., 'EUR')
        to_sym: To currency symbol (e.g., 'USD')
        interval: Time interval between data points ('1min', '5min', '15min', '30min', '60min')
        outputsize: 'compact' (last 100 data points) or 'full' (up to 20-22 days of data)
        
    Returns:
        Dictionary with time series data or empty dict on error
    """
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

def get_quotes(pairs: Optional[List[str]] = None) -> Dict[str, MarketQuote]:
    """Fetch real-time quotes for multiple currency pairs.
    
    Args:
        pairs: List of currency pair symbols (e.g., ['EURUSD', 'GBPUSD']). 
              If None, returns all supported pairs.
              
    Returns:
        Dictionary mapping pair symbols to MarketQuote objects
    """
    if pairs is None:
        pairs = list(ALL_PAIRS.keys())
    
    results = {}
    for pair in pairs:
        pair = pair.upper().replace("/", "")  # Normalize pair format
        if pair not in ALL_PAIRS:
            logger.warning(f"Unsupported currency pair: {pair}")
            continue
            
        pair_info = ALL_PAIRS[pair]
        quote = get_fx_quote(pair_info.from_currency, pair_info.to_currency)
        if quote:
            results[pair] = quote
    
    return results


def get_supported_pairs() -> Dict[str, dict]:
    """Get metadata for all supported currency pairs."""
    return {
        pair: {
            "name": info.name,
            "type": info.type.value,
            "base": info.from_currency,
            "quote": info.to_currency,
            "pip_decimal_places": info.pip_decimal_places,
            "lot_size": info.lot_size,
        }
        for pair, info in ALL_PAIRS.items()
    }


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