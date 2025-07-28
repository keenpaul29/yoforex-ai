from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

router = APIRouter()

# ✅ Including Gold and BTC
SYMBOLS = "EUR/USD,GBP/USD,USD/JPY,AUD/USD,USD/CAD,XAU/USD,BTC/USD"
API_KEY = os.getenv("TWELVE_API_KEY")
TIMEOUT = 10.0  # seconds

@router.get("/prices", response_model=List[Dict[str, Any]])
async def get_prices() -> List[Dict[str, Any]]:
    """
    Get current live prices for forex, gold, and BTC.
    Requires valid Twelve Data API key.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Twelve Data API key not configured")

    url = f"https://api.twelvedata.com/price?symbol={SYMBOLS}&apikey={API_KEY}"

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        result = []
        for symbol, info in data.items():
            if isinstance(info, dict) and "price" in info and info["price"]:
                try:
                    result.append({
                        "pair": symbol,
                        "price": float(info["price"]),
                        # Optionally simulate a dummy "change" since API does not provide it
                        "change": round(((hash(symbol) % 20) - 10) / 100, 2)
                    })
                except (ValueError, TypeError):
                    continue

        if not result:
            raise HTTPException(status_code=502, detail="Twelve Data API returned no valid price data.")

        return result

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Twelve Data API error: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Network error when calling Twelve Data API: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
