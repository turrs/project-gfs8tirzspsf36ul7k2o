#!/bin/bash

# SolSwap Environment Setup Script

echo "🚀 Setting up SolSwap environment files..."

# Backend setup
echo "📁 Setting up backend environment..."
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "⚠️  Backend .env file already exists"
fi

# Frontend setup
echo "📁 Setting up frontend environment..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://ntnyagxlmgxfgxrxbxqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnlhZ3hsbWd4Zmd4cnhieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2NDksImV4cCI6MjA2NzY4MTY0OX0.wxx1wXeBtMx9f8neBLzi-FsUXGRDQ1LIq6Fuku2KsTM

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Solana Configuration
VITE_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-alchemy-key
VITE_FEE_ACCOUNT=A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57
EOF
    echo "✅ Frontend .env file created"
else
    echo "⚠️  Frontend .env file already exists"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your SUPABASE_SERVICE_ROLE_KEY"
echo "2. Generate a JWT_SECRET for backend/.env"
echo "3. Update your Solana RPC URL in .env"
echo "4. Run the database setup script in Supabase SQL Editor"
echo ""
echo "📖 See ENVIRONMENT.md for detailed instructions" 