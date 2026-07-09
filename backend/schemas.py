from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Watchlist Schemas
class WatchlistUpdate(BaseModel):
    tickers: List[str]

class WatchlistOut(BaseModel):
    id: int
    tickers: List[str]
    created_at: datetime
    class Config:
        from_attributes = True

# Strategy Schemas
class StrategyCreate(BaseModel):
    name: str
    ticker: str
    parameters: Dict[str, Any]

class StrategyOut(BaseModel):
    id: int
    name: str
    ticker: str
    parameters: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

# Backtest Schemas
class BacktestRun(BaseModel):
    strategy_id: int

class BacktestOut(BaseModel):
    id: int
    strategy_id: int
    metrics: Dict[str, Any]
    equity_curve: List[Dict[str, Any]]
    trades: List[Dict[str, Any]]
    created_at: datetime
    class Config:
        from_attributes = True

# Research Schemas
class ResearchRequest(BaseModel):
    ticker: str
    focus: Optional[str] = "general"

class ResearchReportOut(BaseModel):
    id: int
    ticker: str
    summary: str
    agent_logs: List[Dict[str, Any]]
    recommendation: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

# Portfolio Schemas
class AssetUpdate(BaseModel):
    ticker: str
    shares: float
    entry_price: float

class PortfolioCreate(BaseModel):
    name: str
    assets: List[AssetUpdate]

class PortfolioOut(BaseModel):
    id: int
    name: str
    assets: List[Dict[str, Any]]
    created_at: datetime
    class Config:
        from_attributes = True

# Journal Schemas
class JournalEntryCreate(BaseModel):
    ticker: str
    action: str # BUY/SELL
    price: float
    quantity: float
    notes: Optional[str] = None

class JournalEntryOut(BaseModel):
    id: int
    ticker: str
    action: str
    price: float
    quantity: float
    notes: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True
