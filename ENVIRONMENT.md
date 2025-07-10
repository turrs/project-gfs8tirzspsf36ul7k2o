# Environment Configuration Guide

## Supabase Configuration

Your Supabase project is already configured with the following details:

### Project Details
- **Project URL**: `https://ntnyagxlmgxfgxrxbxqg.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnlhZ3hsbWd4Zmd4cnhieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2NDksImV4cCI6MjA2NzY4MTY0OX0.wxx1wXeBtMx9f8neBLzi-FsUXGRDQ1LIq6Fuku2KsTM`

## Backend Environment Setup

1. Copy `backend/env.example` to `backend/.env`
2. Update the following variables:

```env
# Supabase Configuration (Already configured)
SUPABASE_URL=https://ntnyagxlmgxfgxrxbxqg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnlhZ3hsbWd4Zmd4cnhieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2NDksImV4cCI6MjA2NzY4MTY0OX0.wxx1wXeBtMx9f8neBLzi-FsUXGRDQ1LIq6Fuku2KsTM

# You need to add your Service Role Key from Supabase Dashboard
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (Generate a secure random string)
JWT_SECRET=your_jwt_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Frontend Environment Setup

1. Create a `.env` file in the root directory
2. Add the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ntnyagxlmgxfgxrxbxqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnlhZ3hsbWd4Zmd4cnhieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2NDksImV4cCI6MjA2NzY4MTY0OX0.wxx1wXeBtMx9f8neBLzi-FsUXGRDQ1LIq6Fuku2KsTM

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Solana Configuration
VITE_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-alchemy-key
VITE_FEE_ACCOUNT=A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57
```

## How to Get Service Role Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ntnyagxlmgxfgxrxbxqg`
3. Go to Settings → API
4. Copy the "service_role" key (not the anon key)
5. Replace `your_service_role_key_here` in your backend `.env` file

## How to Generate JWT Secret

You can generate a secure JWT secret using:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

## Verification Steps

1. **Backend**: Start the server and check for Supabase connection errors
2. **Frontend**: Check browser console for any environment variable errors
3. **Database**: Run the SQL setup script in Supabase SQL Editor

## Security Notes

- Never commit `.env` files to version control
- Keep your service role key secure
- Use different JWT secrets for development and production
- Regularly rotate your secrets

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that your `.env` file exists and has the correct variable names
   - Ensure no extra spaces or quotes around values

2. **"Invalid API key"**
   - Verify you're using the correct anon key for frontend
   - Verify you're using the correct service role key for backend

3. **"CORS errors"**
   - Check that `ALLOWED_ORIGINS` includes your frontend URL
   - Ensure frontend is running on the correct port

4. **"Database connection failed"**
   - Verify your Supabase project is active
   - Check that the database is accessible 