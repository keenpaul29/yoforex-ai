import os
from dotenv import load_dotenv
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import httpx
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Finnhub API key
FINNHUB_TOKEN = os.getenv("FINNHUB_API_KEY")
if not FINNHUB_TOKEN:
    raise ValueError("FINNHUB_API_KEY not found in environment variables")

# Configure a requests Session with retries and default header
_session = requests.Session()
_retries = Retry(total=3, backoff_factor=0.3, status_forcelist=[429, 500, 502, 503, 504])
_adapter = HTTPAdapter(max_retries=_retries)
_session.mount("https://", _adapter)
_session.mount("http://", _adapter)
_session.headers.update({"X-Finnhub-Token": FINNHUB_TOKEN})

# Static mapping for Forex and Crypto
FOREX_SYMBOL_MAP = {
    "XAUUSD": "OANDA:XAU_USD",
    "EURUSD": "OANDA:EUR_USD",
    "GBPUSD": "OANDA:GBP_USD",
    "USDJPY": "OANDA:USD_JPY",
}

CRYPTO_SYMBOL_MAP = {
    "BTCUSD": "BINANCE:BTCUSDT",
    "ETHUSD": "BINANCE:ETHUSDT",
}

def get_ohlcv(symbol: str, resolution: str = "5", count: int = 50):
    sym = symbol.upper()
    if sym in FOREX_SYMBOL_MAP:
        endpoint = "forex/candle"
        api_symbol = FOREX_SYMBOL_MAP[sym]
    elif sym in CRYPTO_SYMBOL_MAP:
        endpoint = "crypto/candle"
        api_symbol = CRYPTO_SYMBOL_MAP[sym]
    else:
        print(f"[get_ohlcv] Unsupported symbol: {sym}")
        return None

    now_ts = int(datetime.now().timestamp())
    try:
        minutes = int(resolution)
        window = minutes * count * 60
    except ValueError:
        window = count * 24 * 3600

    params = {
        "symbol": api_symbol,
        "resolution": resolution,
        "from": now_ts - window,
        "to": now_ts,
    }
    url = f"https://finnhub.io/api/v1/{endpoint}"

    try:
        resp = _session.get(url, params=params, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"[get_ohlcv] Connection or auth error for {sym}: {e}")
        return None

    data = resp.json()
    if data.get("s") != "ok":
        print(f"[get_ohlcv] API returned status {data.get('s')} for {sym}")
        return None

    candles = []
    for t, o, h, l, c, v in zip(
        data.get("t", []), data.get("o", []), data.get("h", []),
        data.get("l", []), data.get("c", []), data.get("v", [])
    ):
        candles.append({
            "time": datetime.fromtimestamp(t).strftime("%Y-%m-%d %H:%M"),
            "open": o,
            "high": h,
            "low": l,
            "close": c,
            "volume": v,
        })
    return candles


class FinnhubService:
    def __init__(self):
        self.api_key = FINNHUB_TOKEN
        self.base_url = "https://finnhub.io/api/v1"
        self.client = httpx.AsyncClient(headers={"X-Finnhub-Token": self.api_key})

    async def get_market_news(self, limit: int = 100):
        """
        Fetch latest trading-related news (forex + filtered general),
        up to the specified limit (default: 100)
        """
        try:
            all_articles = []

            # Step 1: Try forex category
            r_forex = await self.client.get(
                f"{self.base_url}/news",
                params={"category": "forex"},
                timeout=10
            )
            r_forex.raise_for_status()
            forex_news = r_forex.json() or []
            all_articles.extend(forex_news)

            # If less than required, fetch general news too
            if len(all_articles) < limit:
                r_general = await self.client.get(
                    f"{self.base_url}/news",
                    params={"category": "general"},
                    timeout=10
                )
                r_general.raise_for_status()
                general_news = r_general.json() or []

                # Filter general news for trading/forex keywords
                trading_keywords = ["forex", "usd", "eur", "gold", "xauusd", "fomc", "inflation", "interest rate", "fed"]
                filtered_general = [
                    article for article in general_news
                    if any(kw in article.get("headline", "").lower() for kw in trading_keywords)
                ]

                all_articles.extend(filtered_general)

            # Remove duplicates based on headline
            seen = set()
            unique_articles = []
            for article in all_articles:
                headline = article.get("headline", "")
                if headline and headline not in seen:
                    seen.add(headline)
                    unique_articles.append(article)

            return unique_articles[:limit]

        except Exception as e:
            print(f"[get_market_news] Error: {e}")
            return []

    async def get_company_news(self, symbol: str):
        try:
            to_date = datetime.now()
            from_date = to_date - timedelta(days=30)
            r = await self.client.get(
                f"{self.base_url}/company-news",
                params={
                    "symbol": symbol,
                    "from": from_date.strftime("%Y-%m-%d"),
                    "to": to_date.strftime("%Y-%m-%d")
                },
                timeout=10
            )
            r.raise_for_status()
            return r.json()
        except Exception as e:
            print(f"[get_company_news] Error for {symbol}: {e}")
            return []

    async def close(self):
        await self.client.aclose()


# Singleton instance
finnhub_client = FinnhubService()
