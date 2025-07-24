from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import List

router = APIRouter()

class PreTradeCalcRequest(BaseModel):
    entry: float
    stop: float
    risk_pct: float

class PreTradeCalcResponse(BaseModel):
    risk_amount: float
    position_size: float

@router.post("/pretrade/calc", response_model=PreTradeCalcResponse)
async def pretrade_calc(req: PreTradeCalcRequest):
    # assume $10k balance for demo
    risk_amount = req.risk_pct / 100 * 10_000
    position_size = risk_amount / abs(req.entry - req.stop)
    return PreTradeCalcResponse(risk_amount=risk_amount, position_size=position_size)

class AIAnalysisRequest(BaseModel):
    pair: str
    timeframe: str

@router.post("/ai-analysis")
async def ai_analysis(req: AIAnalysisRequest):
    # stub – plug your AI model here
    return {"analysis": f"Signal for {req.pair} on {req.timeframe}"}

class BacktestRequest(BaseModel):
    strategy: str
    pair: str
    from_date: datetime
    to_date: datetime

class BacktestResult(BaseModel):
    total_trades: int
    win_rate: float
    profit_factor: float
    net_profit: float

@router.post("/backtest", response_model=BacktestResult)
async def backtest(req: BacktestRequest):
    # stub – integrate with your backtester
    return BacktestResult(
        total_trades=50, win_rate=0.72, profit_factor=2.5, net_profit=1500
    )

class Calculator(BaseModel):
    id: str
    name: str
    description: str
    parameters: List[str]

@router.get("/calculators", response_model=List[Calculator])
async def get_calculators():
    return [
        Calculator(
            id="position-size",
            name="Position Size Calculator",
            description="Calculate optimal position size based on risk management",
            parameters=["account_balance", "risk_percentage", "stop_loss_pips"]
        ),
        Calculator(
            id="pip-value",
            name="Pip Value Calculator",
            description="Calculate the monetary value of a pip for different currency pairs",
            parameters=["currency_pair", "lot_size", "account_currency"]
        ),
        Calculator(
            id="margin",
            name="Margin Calculator",
            description="Calculate required margin for a trade",
            parameters=["currency_pair", "lot_size", "leverage"]
        ),
        Calculator(
            id="profit-loss",
            name="Profit/Loss Calculator",
            description="Calculate potential profit or loss for a trade",
            parameters=["currency_pair", "lot_size", "entry_price", "exit_price"]
        )
    ]

@router.post("/calculate/{calculator_id}")
async def calculate(calculator_id: str, params: dict):
    # Basic calculation logic - replace with actual implementations
    if calculator_id == "position-size":
        account_balance = params.get("account_balance", 10000)
        risk_percentage = params.get("risk_percentage", 2)
        stop_loss_pips = params.get("stop_loss_pips", 50)

        risk_amount = account_balance * (risk_percentage / 100)
        position_size = risk_amount / stop_loss_pips

        return {
            "result": position_size,
            "risk_amount": risk_amount,
            "recommended_lots": round(position_size / 10000, 2)
        }

    elif calculator_id == "pip-value":
        lot_size = params.get("lot_size", 1)
        return {
            "result": lot_size * 10,  # Simplified pip value calculation
            "currency": "USD"
        }

    elif calculator_id == "margin":
        lot_size = params.get("lot_size", 1)
        leverage = params.get("leverage", 100)
        return {
            "result": (lot_size * 100000) / leverage,
            "currency": "USD"
        }

    elif calculator_id == "profit-loss":
        lot_size = params.get("lot_size", 1)
        entry_price = params.get("entry_price", 1.0000)
        exit_price = params.get("exit_price", 1.0100)

        pips = abs(exit_price - entry_price) * 10000
        profit_loss = pips * lot_size * 10

        return {
            "result": profit_loss if exit_price > entry_price else -profit_loss,
            "pips": pips,
            "currency": "USD"
        }

    else:
        raise HTTPException(status_code=404, detail="Calculator not found")
