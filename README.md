# SolSwap - Solana Token Swap Interface

A modern, decentralized token swap interface built with React, Express.js, and Supabase.

## Features

- 🔄 **Token Swapping**: Seamless token swaps using Jupiter API
- 📊 **TradingView Charts**: Real-time price charts for token pairs
- 💰 **Transaction Tracking**: Complete transaction history and status
- 🔐 **Wallet Integration**: Connect with Phantom and other Solana wallets
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Real-time Updates**: Live transaction status and price updates

## Quick Start

### 1. Setup Environment
```bash
# Run the setup script (Linux/Mac)
chmod +x setup-env.sh
./setup-env.sh

# Or manually copy and configure environment files
cp backend/env.example backend/.env
# Create .env in root directory with Supabase config
```

### 2. Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ntnyagxlmgxfgxrxbxqg`
3. Go to SQL Editor
4. Run `backend/supabase-setup-simple.sql`

### 3. Install Dependencies
```bash
npm install
cd backend && npm install
```

### 4. Start Development Servers
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
npm run dev
```

### 5. Configure Environment
- Update `backend/.env` with your `SUPABASE_SERVICE_ROLE_KEY`
- Generate a `JWT_SECRET` for backend
- Update Solana RPC URL in frontend `.env`

See [ENVIRONMENT.md](ENVIRONMENT.md) for detailed configuration instructions.