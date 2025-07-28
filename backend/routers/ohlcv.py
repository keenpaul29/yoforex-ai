from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from services.oanda_service import get_alphavantage_ohlcv
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tools", tags=["AlphaVantage"])

@router.get("/ohlcv/av")
async def ohlcv_av(pair: str = "EURUSD", resolution: str = "5", count: int = 50) -> Dict[str, Any]:
    """
    Fetch OHLCV data for a given currency pair and resolution.
    
    Args:
        pair: Currency pair (e.g., 'EURUSD', 'GBPUSD')
        resolution: Candle resolution in minutes ('1', '5', '15', '30', '60')
        count: Number of candles to return (max 1000)
        
    Returns:
        Dictionary containing pair, resolution, and candles data
    """
    try:
        # Validate resolution
        if resolution not in ['1', '5', '15', '30', '60']:
            raise HTTPException(
                status_code=400,
                detail="Invalid resolution. Must be one of: '1', '5', '15', '30', '60'"
            )
            
        # Validate count
        count = max(1, min(1000, count))  # Clamp between 1 and 1000
        
        # Get OHLCV data
        data = get_alphavantage_ohlcv(pair, resolution, count)
        
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No data available for {pair} with resolution {resolution}"
            )
            
        return {
            "pair": pair.upper(),
            "resolution": f"{resolution}min",
            "candles": data
        }
        
    except Exception as e:
        logger.error(f"Error fetching OHLCV data: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch OHLCV data: {str(e)}"
        )
