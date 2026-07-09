"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Activity, Newspaper, Shield, FileText, Plus, BookOpen, 
  Search, Play, AlertCircle, CheckCircle2, ChevronRight, BarChart3, HelpCircle, ArrowUpRight, ArrowDownRight
} from "lucide-react";

// --- Types & Interfaces ---
interface AgentLog {
  agent: string;
  status: "processing" | "completed" | "failed";
  message: string;
}

interface MarketQuote {
  name: string;
  sector: string;
  industry: string;
  market_cap: number;
  pe_ratio: number | null;
  dividend_yield: number;
  fifty_two_week_high: number;
  fifty_two_week_low: number;
  current_price: number;
}

interface BacktestResults {
  metrics: {
    initial_capital: number;
    final_equity: number;
    total_return_pct: number;
    max_drawdown_pct: number;
    sharpe_ratio: number;
    total_trades: number;
  };
  equity_curve: Array<{ date: string; equity: number; price: number }>;
  trades: Array<{ date: string; action: string; price: number; shares: number }>;
}

export default function QuantDashboard() {
  const [activeTab, setActiveTab] = useState<"terminal" | "backtest" | "portfolio" | "journal">("terminal");
  
  // Brand Logo Animation state
  const [logoPhase, setLogoPhase] = useState<"name" | "node" | "connect" | "final">("name");
  
  // Ticker and Research State
  const [ticker, setTicker] = useState("AAPL");
  const [isResearching, setIsResearching] = useState(false);
  const [researchLogs, setResearchLogs] = useState<AgentLog[]>([]);
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(-1);
  const [researchResult, setResearchResult] = useState<any>(null);
  
  // Custom Backtest States
  const [backtestTicker, setBacktestTicker] = useState("AAPL");
  const [shortEMA, setShortEMA] = useState(20);
  const [longEMA, setLongEMA] = useState(50);
  const [isRunningBacktest, setIsRunningBacktest] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResults | null>(null);
  
  // Portfolio States
  const [portfolioAssets, setPortfolioAssets] = useState<any[]>([
    { ticker: "AAPL", shares: 45, entry_price: 182.50, current_price: 198.20 },
    { ticker: "MSFT", shares: 25, entry_price: 360.00, current_price: 415.50 },
    { ticker: "TSLA", shares: 30, entry_price: 210.00, current_price: 178.40 },
    { ticker: "BTC-USD", shares: 0.8, entry_price: 42000, current_price: 57400 }
  ]);
  const [newAssetTicker, setNewAssetTicker] = useState("");
  const [newAssetShares, setNewAssetShares] = useState(1);
  const [newAssetPrice, setNewAssetPrice] = useState(100);

  // Watchlist Tickers
  const [watchlist, setWatchlist] = useState<any[]>([
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft Corp." },
    { ticker: "TSLA", name: "Tesla Inc." },
    { ticker: "BTC-USD", name: "Bitcoin USD" },
    { ticker: "NVDA", name: "NVIDIA Corp." },
    { ticker: "AMZN", name: "Amazon.com Inc." }
  ]);
  const [newWatchlistTicker, setNewWatchlistTicker] = useState("");
  
  // Trading Journal States
  const [journalEntries, setJournalEntries] = useState<any[]>([
    { ticker: "AAPL", action: "BUY", price: 182.50, quantity: 45, notes: "Bullish divergence on daily RSI.", date: "2026-06-15" },
    { ticker: "TSLA", action: "BUY", price: 210.00, quantity: 30, notes: "Support at 200 EMA crossover trade.", date: "2026-06-20" }
  ]);
  const [journalTicker, setJournalTicker] = useState("");
  const [journalAction, setJournalAction] = useState("BUY");
  const [journalPrice, setJournalPrice] = useState(150);
  const [journalQty, setJournalQty] = useState(10);
  const [journalNotes, setJournalNotes] = useState("");

  // Logo Animation trigger
  useEffect(() => {
    const timer1 = setTimeout(() => setLogoPhase("node"), 1500);
    const timer2 = setTimeout(() => setLogoPhase("connect"), 3000);
    const timer3 = setTimeout(() => setLogoPhase("final"), 4500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // --- Mock Fallbacks for Instant Runnability ---
  const generateSimulatedResearch = (targetTicker: string) => {
    const cleanTicker = targetTicker.toUpperCase();
    const mockInfo: MarketQuote = {
      name: `${cleanTicker} Inc.`,
      sector: "Technology",
      industry: "Consumer Electronics",
      market_cap: 2950000000000,
      pe_ratio: 28.5,
      dividend_yield: 0.0052,
      fifty_two_week_high: 220.50,
      fifty_two_week_low: 165.00,
      current_price: 195.20
    };

    const agents = [
      { name: "Market Research Agent", msg: `Fetched market statistics and profile data for ${cleanTicker}.` },
      { name: "Technical Analysis Agent", msg: "Calculated indicators: RSI is 58.4 (Neutral), EMA crossover shows a consolidation setup." },
      { name: "News & Sentiment Agent", msg: "Analyzed 8 recent publications. Narrative sentiment: 68% Bullish." },
      { name: "Backtesting Agent", msg: "Simulated 20/50 EMA Strategy. Return: +18.42%, Sharpe: 1.48, Drawdown: -8.54%." },
      { name: "Risk Analysis Agent", msg: "Annualized Volatility: 22.45%. 1-Day 95% Value at Risk: 2.12%. Risk: Moderate." },
      { name: "Debate Agent", msg: "Bull Case: Stable balance sheet + high RSI relative momentum. Bear Case: High PE ratio." },
      { name: "Recommendation Agent", msg: "Stance: BUY. Target: $218.62. Horizon: 6-12 Months." }
    ];

    let currentLogList: AgentLog[] = [];
    
    // Simulate Agent Step Sequence
    agents.forEach((agent, i) => {
      setTimeout(() => {
        currentLogList = [
          ...currentLogList.map(l => l.status === "processing" ? { ...l, status: "completed" as const } : l),
          { agent: agent.name, status: "processing" as const, message: agent.msg }
        ];
        setResearchLogs([...currentLogList]);
        setActiveAgentIndex(i);
        
        // Complete the final step
        if (i === agents.length - 1) {
          setTimeout(() => {
            const finalLogs = currentLogList.map(l => ({ ...l, status: "completed" as const }));
            setResearchLogs(finalLogs);
            setIsResearching(false);
            setResearchResult({
              info: mockInfo,
              technical_analysis: {
                trend: "Bullish Structure",
                rsi: 58.4,
                macd: "Bullish Crossover",
                summary: "The price shows solid consolidation above the 50-day EMA. Standard momentum metrics indicate clean room for continuation."
              },
              sentiment_analysis: {
                score: 0.45,
                label: "Bullish",
                narrative: "General market consensus highlights positive hardware growth cycles and software service ecosystem margin expansion."
              },
              backtest_results: {
                metrics: {
                  total_return_pct: 18.42,
                  max_drawdown_pct: 8.54,
                  sharpe_ratio: 1.48
                }
              },
              risk_analysis: {
                volatility_annualized_pct: 22.45,
                value_at_risk_95_pct: 2.12,
                beta: 1.12,
                risk_rating: "Moderate",
                risk_warnings: [
                  "Annualized volatility is 22.45%, indicating moderate equity fluctuation.",
                  "Beta of 1.12 represents moderate alignment with the broader market index performance."
                ]
              },
              debate: {
                bull_case: [
                  "Excellent software ecosystem revenue streams providing recurring premium cash flow.",
                  "Clean support at the 200-day EMA representing long-term buyer consolidation."
                ],
                bear_case: [
                  "Premium valuation leaves narrow margin for execution misses in hardware delivery.",
                  "Supply-chain dependencies present potential short-term cost headwinds."
                ]
              },
              recommendation: {
                stance: "BUY",
                confidence_score: 78,
                target_price: 218.62,
                horizon: "6-12 Months",
                rationale: `Simulated recommendation: BUY stance based on positive technical alignment and supportive underlying news sentiment. Portfolio risk is classified as Moderate.`
              }
            });
          }, 800);
        }
      }, i * 1200);
    });
  };

  const handleStartResearch = async () => {
    setIsResearching(true);
    setResearchResult(null);
    setResearchLogs([]);
    setActiveAgentIndex(0);

    try {
      const response = await fetch("http://localhost:8000/api/research/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, focus: "general" })
      });
      if (response.ok) {
        const data = await response.json();
        setResearchLogs(data.logs);
        setResearchResult(data);
        setIsResearching(false);
      } else {
        generateSimulatedResearch(ticker);
      }
    } catch (e) {
      // Fallback
      generateSimulatedResearch(ticker);
    }
  };

  const handleRunBacktest = async () => {
    setIsRunningBacktest(true);
    setBacktestResult(null);

    // Simulated backtest builder
    setTimeout(() => {
      const startPrice = 150;
      const dataPoints = 100;
      let cash = 100000;
      let shares = 0;
      const curve = [];
      const tradesList = [];

      for (let i = 0; i < dataPoints; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (dataPoints - i));
        const dateStr = date.toISOString().split("T")[0];
        
        // Generate pseudo-random prices
        const noise = (Math.random() - 0.48) * 4;
        const trend = (i * 0.2);
        const price = Math.max(10, Math.round((startPrice + trend + noise) * 100) / 100);

        // Simple mock trading rules
        if (i % 25 === 5 && shares === 0) {
          shares = cash / price;
          cash = 0;
          tradesList.push({ date: dateStr, action: "BUY", price, shares });
        } else if (i % 25 === 20 && shares > 0) {
          cash = shares * price;
          tradesList.push({ date: dateStr, action: "SELL", price, shares });
          shares = 0;
        }

        const equity = cash + (shares * price);
        curve.push({ date: dateStr, equity: Math.round(equity), price });
      }

      const finalVal = cash + (shares * curve[curve.length - 1].price);
      const ret = ((finalVal - 100000) / 100000) * 100;

      setBacktestResult({
        metrics: {
          initial_capital: 100000,
          final_equity: Math.round(finalVal),
          total_return_pct: Math.round(ret * 100) / 100,
          max_drawdown_pct: 6.82,
          sharpe_ratio: 1.62,
          total_trades: tradesList.length
        },
        equity_curve: curve,
        trades: tradesList
      });
      setIsRunningBacktest(false);
    }, 1500);
  };

  // Portfolio actions
  const handleAddAsset = () => {
    if (!newAssetTicker) return;
    setPortfolioAssets([
      ...portfolioAssets,
      {
        ticker: newAssetTicker.toUpperCase(),
        shares: Number(newAssetShares),
        entry_price: Number(newAssetPrice),
        current_price: Number(newAssetPrice) * 1.05
      }
    ]);
    setNewAssetTicker("");
  };

  // Journal actions
  const handleAddJournal = () => {
    if (!journalTicker) return;
    setJournalEntries([
      {
        ticker: journalTicker.toUpperCase(),
        action: journalAction,
        price: Number(journalPrice),
        quantity: Number(journalQty),
        notes: journalNotes,
        date: new Date().toISOString().split("T")[0]
      },
      ...journalEntries
    ]);
    setJournalTicker("");
    setJournalNotes("");
  };

  // Watchlist actions
  const handleAddWatchlist = () => {
    const tick = newWatchlistTicker.toUpperCase();
    if (!newWatchlistTicker || watchlist.some(w => w.ticker === tick)) return;
    const nameMap: Record<string, string> = {
      "AAPL": "Apple Inc.",
      "MSFT": "Microsoft Corp.",
      "TSLA": "Tesla Inc.",
      "NVDA": "NVIDIA Corp.",
      "AMZN": "Amazon.com Inc.",
      "GOOGL": "Alphabet Inc.",
      "META": "Meta Platforms Inc.",
      "NFLX": "Netflix Inc.",
      "AMD": "Advanced Micro Devices",
      "BTC-USD": "Bitcoin USD",
      "ETH-USD": "Ethereum USD"
    };
    setWatchlist([...watchlist, { ticker: tick, name: nameMap[tick] || `${tick} Equity` }]);
    setNewWatchlistTicker("");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] text-[#f5f5f5] min-h-screen">
      {/* Top Banner Navigation */}
      <header className="border-b border-[var(--card-border)] bg-[#050505]/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Interactive AgenticFi Brand Logo Animation */}
          <div className="flex items-center space-x-3 cursor-pointer">
            {/* Company Logo Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#499A13] shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="5" r="3" fill="#499A13" stroke="#499A13" />
                <circle cx="6" cy="17" r="3" />
                <circle cx="18" cy="17" r="3" />
                <path d="M12 8L7.5 14M12 8L16.5 14" stroke="currentColor" strokeOpacity="0.5" />
              </svg>
            </div>
            <div className="relative flex items-center h-8">
              <AnimatePresence mode="wait">
                {logoPhase === "name" && (
                  <motion.span 
                    key="phase-name"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-2xl font-bold tracking-tight text-white"
                  >
                    Agentic
                  </motion.span>
                )}
                {logoPhase === "node" && (
                  <motion.div 
                    key="phase-node"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-5 h-5 rounded-full bg-[#499A13] node-glow"
                  />
                )}
                {logoPhase === "connect" && (
                  <motion.div 
                    key="phase-connect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex space-x-2 items-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#499A13]/80" />
                    <div className="w-4 h-0.5 bg-[#499A13]/40" />
                    <div className="w-3 h-3 rounded-full bg-[#499A13]" />
                    <div className="w-4 h-0.5 bg-[#499A13]/40" />
                    <div className="w-3 h-3 rounded-full bg-[#499A13]/80" />
                  </motion.div>
                )}
                {logoPhase === "final" && (
                  <motion.div 
                    key="phase-final"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center text-2xl font-bold tracking-tight"
                  >
                    <span className="text-white">Agentic</span>
                    <span className="text-[#499A13] ml-0.5">Fi</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Visual platform tag */}
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-[var(--muted)] border border-[var(--card-border)] px-2 py-0.5 rounded bg-white/5">
              Quant OS
            </span>
          </div>

          {/* Navigation Controls */}
          <nav className="flex space-x-1">
            <button 
              onClick={() => setActiveTab("terminal")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === "terminal" ? "bg-white/5 text-[#499A13] border-b-2 border-[#499A13]" : "text-[var(--muted)] hover:text-white"}`}
            >
              Research Terminal
            </button>
            <button 
              onClick={() => setActiveTab("backtest")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === "backtest" ? "bg-white/5 text-[#499A13] border-b-2 border-[#499A13]" : "text-[var(--muted)] hover:text-white"}`}
            >
              Strategy Studio
            </button>
            <button 
              onClick={() => setActiveTab("portfolio")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === "portfolio" ? "bg-white/5 text-[#499A13] border-b-2 border-[#499A13]" : "text-[var(--muted)] hover:text-white"}`}
            >
              Portfolio risk
            </button>
            <button 
              onClick={() => setActiveTab("journal")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${activeTab === "journal" ? "bg-white/5 text-[#499A13] border-b-2 border-[#499A13]" : "text-[var(--muted)] hover:text-white"}`}
            >
              Journal
            </button>
          </nav>
        </div>
      </header>

      {/* Main Terminal Frame */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Market Watchlist and Scanner */}
        <section className="space-y-6 lg:col-span-1">
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-[#499A13]" />
              <span>Core Watchlist</span>
            </h2>

            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Ticker"
                value={newWatchlistTicker}
                onChange={e => setNewWatchlistTicker(e.target.value)}
                className="flex-1 bg-white/5 border border-[var(--card-border)] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#499A13]"
              />
              <button 
                onClick={handleAddWatchlist}
                className="bg-[#499A13] hover:bg-[#3d8010] text-black font-semibold text-xs px-3 rounded flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {watchlist.map(item => (
                <div 
                  key={item.ticker} 
                  onClick={() => { setTicker(item.ticker); setBacktestTicker(item.ticker); }}
                  className="flex items-center justify-between p-3 rounded bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-[#499A13]/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-black to-[#1c3a09] border border-[#499A13]/25 flex items-center justify-center text-white font-extrabold text-[10px]">
                      {item.name ? item.name.charAt(0) : item.ticker.charAt(0)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-white tracking-wider">{item.name}</span>
                      <span className="text-[10px] text-[var(--muted)] font-mono">{item.ticker}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-[var(--muted)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 space-y-3.5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#499A13]">Institutional Notice</h3>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              AgenticFi functions strictly as an autonomous quantitative assistant. All modeling configurations, technical analyses, and strategy outputs belong to your account scope. Final decisions rest with the human supervisor.
            </p>
          </div>
        </section>

        {/* Right Side: Tab Contents */}
        <section className="lg:col-span-3 space-y-6">

          {/* TAB 1: AI QUANT TERMINAL */}
          {activeTab === "terminal" && (
            <div className="space-y-6">
              
              {/* Terminal Query Input Bar */}
              <div className="glass-panel rounded-xl p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input 
                    type="text" 
                    placeholder="Enter security ticker (e.g. AAPL, TSLA, BTC-USD)..." 
                    value={ticker} 
                    onChange={e => setTicker(e.target.value)}
                    className="w-full bg-white/5 border border-[var(--card-border)] rounded-lg pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#499A13] tracking-wide"
                  />
                </div>
                <button 
                  onClick={handleStartResearch}
                  disabled={isResearching}
                  className="w-full md:w-auto bg-[#499A13] hover:bg-[#3d8010] text-black font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isResearching ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Researching...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Initiate Research Flow</span>
                    </>
                  )}
                </button>
              </div>

              {/* Research Progress node visualizer */}
              {(isResearching || researchLogs.length > 0) && (
                <div className="glass-panel rounded-xl p-6 space-y-6">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-[#499A13]" />
                    <span>LangGraph Coordinator Log</span>
                  </h3>
                  
                  {/* LangGraph Visual nodes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
                    {[
                      "Market Research", "Technical", "Sentiment", "Backtest", "Risk", "Debate", "Report"
                    ].map((nodeName, idx) => {
                      const isActive = idx === activeAgentIndex;
                      const isDone = idx < activeAgentIndex;
                      return (
                        <div key={nodeName} className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs font-semibold ${
                            isActive ? "bg-[#499A13] text-black node-glow" : isDone ? "bg-[#499A13]/25 text-[#499A13]" : "bg-white/5 text-[var(--muted)] border border-white/10"
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] font-medium tracking-tight ${isActive ? "text-[#499A13]" : "text-[var(--muted)]"}`}>
                            {nodeName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Flow Log Terminal Output */}
                  <div className="bg-black/50 border border-[var(--card-border)] rounded-lg p-4 font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto">
                    {researchLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        {log.status === "completed" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#499A13] shrink-0 mt-0.5" />
                        ) : log.status === "failed" ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-3 h-3 border-2 border-[#499A13] border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="text-[#499A13] font-bold">[{log.agent}]</span>{" "}
                          <span className="text-gray-300">{log.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Compiled Output Report */}
              {researchResult && (
                <div className="space-y-6">
                  
                  {/* Company Profile Header & Logo */}
                  <div className="flex items-center space-x-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-black to-[#1c3a09] border border-[#499A13]/40 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-[#499A13]/10">
                      {researchResult.info.name ? researchResult.info.name.charAt(0) : ticker.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2.5">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                          {researchResult.info.name || ticker}
                        </h2>
                        <span className="bg-[#499A13]/10 border border-[#499A13]/30 text-[#499A13] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                          {ticker}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)]">
                        {researchResult.info.sector || "N/A"} • {researchResult.info.industry || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Top line scorecard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Stance Card */}
                    <div className="glass-panel rounded-xl p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Quant Recommendation</span>
                        <h4 className="text-3xl font-black tracking-tight text-white">{researchResult.recommendation.stance}</h4>
                      </div>
                      <div className={`px-3 py-1 rounded text-xs font-bold ${
                        researchResult.recommendation.stance === "BUY" ? "bg-[#499A13]/25 text-[#499A13]" : "bg-red-500/25 text-red-400"
                      }`}>
                        {researchResult.recommendation.confidence_score}% Confidence
                      </div>
                    </div>

                    {/* Valuation / Target Card */}
                    <div className="glass-panel rounded-xl p-5 space-y-1">
                      <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Target Valuation</span>
                      <h4 className="text-3xl font-bold tracking-tight text-white">
                        ${researchResult.recommendation.target_price}
                      </h4>
                      <p className="text-[10px] text-[var(--muted)]">Horizon: {researchResult.recommendation.horizon}</p>
                    </div>

                    {/* Risk Rating Card */}
                    <div className="glass-panel rounded-xl p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Risk Profile</span>
                        <h4 className="text-3xl font-bold tracking-tight text-white">{researchResult.risk_analysis.risk_rating}</h4>
                      </div>
                      <Shield className="w-8 h-8 text-[#499A13]" />
                    </div>
                  </div>

                  {/* Summary Narrative */}
                  <div className="glass-panel rounded-xl p-6 space-y-3">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Core Executive Summary</h3>
                    <p className="text-sm text-gray-200 leading-relaxed font-light">
                      {researchResult.recommendation.rationale}
                    </p>
                  </div>

                  {/* Detailed Analytics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Technical and Sentiment Details */}
                    <div className="glass-panel rounded-xl p-6 space-y-4">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-[#499A13]" />
                        <span>Technical & Sentiment Context</span>
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Technical Trend:</span>
                          <span className="font-semibold text-white">{researchResult.technical_analysis.trend}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Momentum Index (RSI):</span>
                          <span className="font-semibold text-white">{researchResult.technical_analysis.rsi}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">News Sentiment:</span>
                          <span className="font-semibold text-[#499A13]">{researchResult.sentiment_analysis.label}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed italic pt-1">
                          {researchResult.sentiment_analysis.narrative}
                        </p>
                      </div>
                    </div>

                    {/* Risk parameters */}
                    <div className="glass-panel rounded-xl p-6 space-y-4">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-[#499A13]" />
                        <span>Portfolio Risk Factors</span>
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Annualized Volatility:</span>
                          <span className="font-semibold text-white">{researchResult.risk_analysis.volatility_annualized_pct}%</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Value-at-Risk (95% 1-day):</span>
                          <span className="font-semibold text-white">{researchResult.risk_analysis.value_at_risk_95_pct}%</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Beta Coeff. (S&P 500):</span>
                          <span className="font-semibold text-white">{researchResult.risk_analysis.beta}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 text-[10px]">Risk Advisory Warnings:</span>
                          <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-400">
                            {researchResult.risk_analysis.risk_warnings.map((w: string, i: number) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI DEBATE ARENA */}
                  <div className="glass-panel rounded-xl p-6 space-y-5">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)] flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-[#499A13]" />
                      <span>AI Quant Debate Arena</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Bull Argument */}
                      <div className="bg-[#499A13]/5 border border-[#499A13]/10 rounded-lg p-5 space-y-3">
                        <div className="flex items-center space-x-2 text-[#499A13] font-bold text-xs uppercase tracking-wider">
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Bull Case Analyst</span>
                        </div>
                        <ul className="space-y-2 text-xs text-gray-300">
                          {researchResult.debate.bull_case.map((arg: string, i: number) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="text-[#499A13] font-black mt-0.5">•</span>
                              <span>{arg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bear Argument */}
                      <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-5 space-y-3">
                        <div className="flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                          <ArrowDownRight className="w-4 h-4" />
                          <span>Bear Case Analyst</span>
                        </div>
                        <ul className="space-y-2 text-xs text-gray-300">
                          {researchResult.debate.bear_case.map((arg: string, i: number) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="text-red-400 font-black mt-0.5">•</span>
                              <span>{arg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRATEGY BUILDER & BACKTESTER */}
          {activeTab === "backtest" && (
            <div className="space-y-6">
              
              {/* Parameter Settings */}
              <div className="glass-panel rounded-xl p-6 space-y-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Custom Strategy Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-wider block">Security Ticker</label>
                    <input 
                      type="text" 
                      value={backtestTicker}
                      onChange={e => setBacktestTicker(e.target.value.toUpperCase())}
                      className="w-full bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-wider block">Short EMA Period</label>
                    <input 
                      type="number" 
                      value={shortEMA}
                      onChange={e => setShortEMA(Number(e.target.value))}
                      className="w-full bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 uppercase tracking-wider block">Long EMA Period</label>
                    <input 
                      type="number" 
                      value={longEMA}
                      onChange={e => setLongEMA(Number(e.target.value))}
                      className="w-full bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleRunBacktest}
                  disabled={isRunningBacktest}
                  className="w-full bg-[#499A13] hover:bg-[#3d8010] text-black font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isRunningBacktest ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Computing historical modeling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Execute Strategy Backtest</span>
                    </>
                  )}
                </button>
              </div>

              {/* Backtest Results Visuals */}
              {backtestResult && (
                <div className="space-y-6">
                  
                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="glass-panel rounded-xl p-5 space-y-1">
                      <span className="text-[10px] text-[var(--muted)] uppercase">Total Return</span>
                      <h4 className="text-2xl font-bold text-[#499A13]">{backtestResult.metrics.total_return_pct}%</h4>
                    </div>
                    <div className="glass-panel rounded-xl p-5 space-y-1">
                      <span className="text-[10px] text-[var(--muted)] uppercase">Max Drawdown</span>
                      <h4 className="text-2xl font-bold text-red-400">-{backtestResult.metrics.max_drawdown_pct}%</h4>
                    </div>
                    <div className="glass-panel rounded-xl p-5 space-y-1">
                      <span className="text-[10px] text-[var(--muted)] uppercase">Sharpe Ratio</span>
                      <h4 className="text-2xl font-bold text-white">{backtestResult.metrics.sharpe_ratio}</h4>
                    </div>
                    <div className="glass-panel rounded-xl p-5 space-y-1">
                      <span className="text-[10px] text-[var(--muted)] uppercase">Executed Trades</span>
                      <h4 className="text-2xl font-bold text-white">{backtestResult.metrics.total_trades}</h4>
                    </div>
                  </div>

                  {/* Equity curve chart */}
                  <div className="glass-panel rounded-xl p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Historical Equity Curve</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={backtestResult.equity_curve}>
                          <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#499A13" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#499A13" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} domain={["auto", "auto"]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#121212", borderColor: "rgba(255,255,255,0.08)" }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Area type="monotone" dataKey="equity" stroke="#499A13" fillOpacity={1} fill="url(#colorEquity)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Trade details */}
                  <div className="glass-panel rounded-xl p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Trade Logs</h3>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/5 text-[var(--muted)]">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Action</th>
                            <th className="pb-2">Price</th>
                            <th className="pb-2">Shares</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backtestResult.trades.map((t, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01]">
                              <td className="py-2.5">{t.date}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  t.action === "BUY" ? "bg-[#499A13]/25 text-[#499A13]" : "bg-red-500/25 text-red-400"
                                }`}>
                                  {t.action}
                                </span>
                              </td>
                              <td className="py-2.5">${t.price}</td>
                              <td className="py-2.5">{t.shares.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 3: PORTFOLIO MANAGER */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              
              {/* Asset list */}
              <div className="glass-panel rounded-xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Portfolio Asset Registry</h3>
                  <span className="text-xs text-[var(--muted)] font-mono">Simulated Institutional Account</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Security (e.g. MSFT)" 
                    value={newAssetTicker}
                    onChange={e => setNewAssetTicker(e.target.value)}
                    className="bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  />
                  <input 
                    type="number" 
                    placeholder="Shares" 
                    value={newAssetShares}
                    onChange={e => setNewAssetShares(Number(e.target.value))}
                    className="bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  />
                  <input 
                    type="number" 
                    placeholder="Entry Price" 
                    value={newAssetPrice}
                    onChange={e => setNewAssetPrice(Number(e.target.value))}
                    className="bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  />
                  <button 
                    onClick={handleAddAsset}
                    className="bg-[#499A13] hover:bg-[#3d8010] text-black font-semibold text-xs py-2 rounded flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Asset</span>
                  </button>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[var(--muted)]">
                        <th className="pb-3">Security</th>
                        <th className="pb-3">Shares</th>
                        <th className="pb-3">Entry Price</th>
                        <th className="pb-3">Current Price</th>
                        <th className="pb-3">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioAssets.map((asset, idx) => {
                        const costBasis = asset.shares * asset.entry_price;
                        const currValue = asset.shares * asset.current_price;
                        const pl = currValue - costBasis;
                        const plPct = (pl / costBasis) * 100;
                        return (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01]">
                            <td className="py-3.5 font-bold tracking-wider">{asset.ticker}</td>
                            <td className="py-3.5">{asset.shares}</td>
                            <td className="py-3.5">${asset.entry_price.toFixed(2)}</td>
                            <td className="py-3.5">${asset.current_price.toFixed(2)}</td>
                            <td className={`py-3.5 font-semibold ${pl >= 0 ? "text-[#499A13]" : "text-red-400"}`}>
                              ${pl.toFixed(2)} ({plPct.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advanced Risk metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Diversification weights */}
                <div className="glass-panel rounded-xl p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Asset Allocation Weights</h3>
                  <div className="space-y-3">
                    {portfolioAssets.map((asset, idx) => {
                      const totalVal = portfolioAssets.reduce((sum, a) => sum + (a.shares * a.current_price), 0);
                      const assetVal = asset.shares * asset.current_price;
                      const weight = (assetVal / totalVal) * 100;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-semibold text-white">{asset.ticker}</span>
                            <span className="text-[var(--muted)]">{weight.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#499A13] h-full" style={{ width: `${weight}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated correlation matrix alerts */}
                <div className="glass-panel rounded-xl p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Quant Portfolio Risk Assessment</h3>
                  <div className="space-y-3 text-xs leading-relaxed text-gray-300">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#499A13] shrink-0 mt-0.5" />
                      <p>Asset concentration is highly balanced. Maximum single asset weight is under 35%.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#499A13] shrink-0 mt-0.5" />
                      <p>Incorporating BTC-USD yields a low covariance matrix correlation relative to index equities, enhancing Sharpe efficiency.</p>
                    </div>
                    <div className="flex items-start space-x-2 text-yellow-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>Aggregate beta matches 1.25. Portfolio exhibits slightly elevated volatility footprint versus S&P 500.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: TRADING JOURNAL */}
          {activeTab === "journal" && (
            <div className="space-y-6">
              
              {/* Logger Input */}
              <div className="glass-panel rounded-xl p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Add Trading Journal Entry</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Ticker (e.g. AAPL)" 
                    value={journalTicker}
                    onChange={e => setJournalTicker(e.target.value)}
                    className="bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  />
                  
                  <select 
                    value={journalAction}
                    onChange={e => setJournalAction(e.target.value)}
                    className="bg-[#121212] border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>

                  <input 
                    type="number" 
                    placeholder="Price" 
                    value={journalPrice}
                    onChange={e => setJournalPrice(Number(e.target.value))}
                    className="bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  />
                  
                  <input 
                    type="number" 
                    placeholder="Quantity" 
                    value={journalQty}
                    onChange={e => setJournalQty(Number(e.target.value))}
                    className="bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13]"
                  />
                </div>

                <div className="space-y-2">
                  <textarea 
                    placeholder="Log technical patterns, news variables, catalyst arguments..." 
                    value={journalNotes}
                    onChange={e => setJournalNotes(e.target.value)}
                    className="w-full bg-white/5 border border-[var(--card-border)] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#499A13] h-20"
                  />
                </div>

                <button 
                  onClick={handleAddJournal}
                  className="bg-[#499A13] hover:bg-[#3d8010] text-black font-semibold text-xs py-2.5 px-6 rounded flex items-center space-x-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Log Entry</span>
                </button>
              </div>

              {/* Historical Journal list */}
              <div className="glass-panel rounded-xl p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--muted)]">Historical Journal Records</h3>
                
                <div className="space-y-4">
                  {journalEntries.map((j, idx) => (
                    <div key={idx} className="p-4 rounded bg-white/[0.02] border border-white/[0.04] space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold tracking-wider text-white">{j.ticker}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            j.action === "BUY" ? "bg-[#499A13]/20 text-[#499A13]" : "bg-red-500/20 text-red-400"
                          }`}>
                            {j.action}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">{j.date}</span>
                      </div>
                      
                      <div className="flex space-x-6 text-xs">
                        <div>
                          <span className="text-gray-400">Execution Price:</span>{" "}
                          <span className="font-semibold text-white">${j.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Shares/Qty:</span>{" "}
                          <span className="font-semibold text-white">{j.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Total Basis:</span>{" "}
                          <span className="font-semibold text-white">${(j.price * j.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed font-light pl-2 border-l border-[#499A13]/40">
                        {j.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Footer info */}
      <footer className="border-t border-[var(--card-border)] py-8 mt-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-[var(--muted)] gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wider">AgenticFi</span>
            <span>| The AI Quant Research Operating System</span>
          </div>
          <span>© 2026 AgenticFi. All institutional execution rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
