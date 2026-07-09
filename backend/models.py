import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    strategies = relationship("Strategy", back_populates="user", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tickers = Column(JSON, nullable=False, default=list) # List of tickers e.g., ["AAPL", "TSLA"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="watchlists")

class Strategy(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    ticker = Column(String, nullable=False)
    parameters = Column(JSON, nullable=False) # e.g. {"short_window": 50, "long_window": 200}
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="strategies")
    backtests = relationship("Backtest", back_populates="strategy", cascade="all, delete-orphan")

class Backtest(Base):
    __tablename__ = "backtests"

    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(Integer, ForeignKey("strategies.id"), nullable=False)
    metrics = Column(JSON, nullable=False) # Sharpe ratio, max drawdown, etc.
    equity_curve = Column(JSON, nullable=False) # Price/equity timeseries
    trades = Column(JSON, nullable=False) # List of trade history
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    strategy = relationship("Strategy", back_populates="backtests")

class ResearchReport(Base):
    __tablename__ = "research_reports"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    agent_logs = Column(JSON, nullable=False) # Detailed conversation / workflow trace
    recommendation = Column(JSON, nullable=False) # confidence score, target price, stance
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False, default="Default Portfolio")
    assets = Column(JSON, nullable=False, default=list) # e.g. [{"ticker": "AAPL", "shares": 10, "entry_price": 180.0}]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="portfolios")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ticker = Column(String, nullable=False)
    action = Column(String, nullable=False) # BUY or SELL
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="journal_entries")
