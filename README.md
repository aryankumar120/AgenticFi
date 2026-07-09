# AgenticFi

> **The AI Quant Research Operating System**

AgenticFi is an enterprise-grade AI Quantitative Research Platform powered by Agentic AI. It automates technical analysis, technical indicators computation, news sentiment parsing, historical backtesting, portfolio allocation, and risk management. It coordinates specialized agents to deliver structured research reports.

---
## Demo Video


https://github.com/user-attachments/assets/897afafc-bbc5-47b1-8849-e0de673944ed


## Technical Architecture

The platform utilizes a multi-agent quantitative pipeline orchestrated via **LangGraph** and **FastAPI**:

```
[ Market Ticker ]
       │
       ▼
 ┌───────────┐      ┌──────────────┐      ┌─────────────┐
 │  Market   │ ───> │  Technical   │ ───> │  Sentiment  │
 │  Research │      │   Analysis   │      │   Analyst   │
 └───────────┘      └──────────────┘      └─────────────┘
                                                 │
                                                 ▼
 ┌───────────┐      ┌──────────────┐      ┌─────────────┐
 │  Debate   │ <─── │ Risk & Port  │ <─── │ Backtesting │
 │ Panelists │      │  Assessment  │      │   Engine    │
 └───────────┘      └──────────────┘      └─────────────┘
       │
       ▼
 ┌───────────┐
 │ Final Rec │
 └───────────┘
```

1. **Market Research Agent**: Retrieves corporate metadata and fundamentals using `yfinance`.
2. **Technical Analysis Agent**: Computes EMA trends, Relative Strength Index (RSI), MACD, and Bollinger Bands.
3. **News Sentiment Agent**: Scores real-time news articles from Yahoo Finance news feed.
4. **Backtesting Agent**: Simulates technical moving average crossover strategies on 1-year historical data.
5. **Risk Analysis Agent**: Computes annualized volatility, Value-at-Risk (VaR), and benchmark correlation (Beta).
6. **AI Debate Agent**: Simulates a Bull vs. Bear panel debate to expose risks and upside opportunities.
7. **Recommendation Agent**: Aggregates all reports to calculate the final consensus confidence rating.

---

## Directory Layout

* `backend/`: FastAPI server housing database schemas, market services, and LangGraph workflow.
  * `agents/`: Orchestration nodes.
  * `main.py`: REST routes.
* `frontend/`: Next.js web application built with TypeScript, Tailwind CSS, Recharts, and Framer Motion.

---

## Installation & Setup

### Prerequisites
* Python 3.9+
* Node.js 18+

### Backend Setup
1. Change directory to `backend`:
   ```bash
   cd backend
   ```
2. Set up a virtual environment and install packages:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set your environment variables in `.env` (refer to `.env.example`).
4. Start the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Change directory to `frontend`:
   ```bash
   cd ../frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the terminal.
