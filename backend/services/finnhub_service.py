import os
import httpx
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

class FinnhubService:
    def __init__(self):
        self.api_key = os.getenv("FINNHUB_API_KEY")
        if not self.api_key:
            raise ValueError("FINNHUB_API_KEY not found in environment variables")
        self.base_url = "https://finnhub.io/api/v1"
        self.client = httpx.AsyncClient()

    async def get_market_news(self):
        """Fetch general market news"""
        try:
            # Ensure api_key is not None and strip any whitespace
            api_key = (self.api_key or '').strip()
            if not api_key:
                print("Error: FINNHUB_API_KEY is not set or empty")
                return []
                
            # Log the base URL and token (first 4 and last 4 chars for security)
            token_display = f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) > 8 else "[invalid]"
            print(f"Fetching news from {self.base_url} with token: {token_display}")
            
            response = await self.client.get(
                f"{self.base_url}/news",
                params={
                    "category": "general",
                    "token": api_key  # Use the cleaned API key
                },
                timeout=10.0  # Add timeout to prevent hanging
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            print(f"HTTP error fetching market news: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            print(f"Error fetching market news: {str(e)}")
            return []

    async def get_company_news(self, symbol: str):
        """Fetch news for a specific company"""
        try:
            # Ensure api_key is not None and strip any whitespace
            api_key = (self.api_key or '').strip()
            if not api_key:
                print("Error: FINNHUB_API_KEY is not set or empty")
                return []
                
            # Get date range (last 30 days)
            to_date = datetime.now()
            from_date = to_date - timedelta(days=30)
            
            response = await self.client.get(
                f"{self.base_url}/company-news",
                params={
                    "symbol": symbol,
                    "from": from_date.strftime('%Y-%m-%d'),
                    "to": to_date.strftime('%Y-%m-%d'),
                    "token": api_key  # Use the cleaned API key
                },
                timeout=10.0  # Add timeout to prevent hanging
            )
            response.raise_for_status()
            return response.json()
            
        except httpx.HTTPStatusError as e:
            print(f"HTTP error fetching company news: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            print(f"Error fetching company news for {symbol}: {str(e)}")
            return []

    async def close(self):
        await self.client.aclose()

# Create a singleton instance
finnhub_client = FinnhubService()
