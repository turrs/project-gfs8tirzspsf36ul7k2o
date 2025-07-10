# SolSwap Setup Instructions

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Solana wallet (Phantom recommended)

## 1. Database Setup

### Step 1: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `backend/supabase-setup-simple.sql`
4. Execute the SQL commands

This will create:
- `transactions` table with wallet_address field
- Proper indexes for performance
- Row Level Security (RLS) policies
- Sample transaction data

### Step 2: Additional Sample Data (Optional)

If you want to add more sample transaction data:

1. Go to SQL Editor
2. Copy and paste the contents of `backend/add-sample-data.sql`
3. Execute the SQL commands

This will:
- Insert additional sample transactions
- Verify the data was inserted correctly

## 2. Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Environment Configuration
1. Copy `backend/env.example` to `backend/.env`
2. Update the environment variables:

```env
# Supabase Configuration
SUPABASE_URL=https://ntnyagxlmgxfgxrxbxqg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnlhZ3hsbWd4Zmd4cnhieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2NDksImV4cCI6MjA2NzY4MTY0OX0.wxx1wXeBtMx9f8neBLzi-FsUXGRDQ1LIq6Fuku2KsTM
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Start Backend Server
```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

## 3. Frontend Setup

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:

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

### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 4. Features Overview

### Backend Features
- ✅ User authentication with JWT
- ✅ Transaction management
- ✅ Rate limiting and security
- ✅ CORS configuration
- ✅ Supabase integration
- ✅ Error handling and logging

### Frontend Features
- ✅ Solana wallet integration
- ✅ Jupiter swap integration
- ✅ Real-time transaction tracking
- ✅ TradingView chart integration
- ✅ Token search functionality
- ✅ Responsive design
- ✅ Authentication context

### Database Features
- ✅ Transaction storage
- ✅ User profiles
- ✅ Row Level Security
- ✅ Automatic timestamps
- ✅ Performance indexes

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Transactions
- `GET /api/transactions/recent` - Get recent transactions
- `GET /api/transactions/user` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PATCH /api/transactions/:id` - Update transaction
- `GET /api/transactions/:id` - Get specific transaction

### Health
- `GET /api/health` - Health check

## 6. Testing the Integration

1. **Start both servers** (backend on port 3001, frontend on port 5173)
2. **Connect wallet** - Click "Connect Wallet" button
3. **Register/Login** - Use the authentication system
4. **Perform a swap** - Select tokens and execute a swap
5. **Check transactions** - View recent transactions in the UI
6. **Verify backend** - Check the backend logs and database

## 7. Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` in backend matches frontend URL
2. **Database Connection**: Verify Supabase credentials and RLS policies
3. **Wallet Connection**: Make sure Phantom wallet is installed
4. **API Errors**: Check backend logs for detailed error messages

### Debug Mode
Enable debug logging in backend by setting `NODE_ENV=development`

### Database Reset
If you need to reset the database:

1. **Complete Reset**: Run `backend/reset-database.sql` in Supabase SQL Editor
2. **Partial Reset**: Drop the table manually and run `backend/supabase-setup-safe.sql` again

### Database Issues
If you encounter database errors:

1. **Table not found**: Run `backend/supabase-setup-safe.sql` again
2. **Permission errors**: Check RLS policies in Supabase dashboard
3. **Data not showing**: Verify the wallet addresses match

## 8. Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update CORS origin to production domain
3. Use environment variables for all secrets
4. Set up proper SSL certificates

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update environment variables for production

### Database
1. Enable Row Level Security in production
2. Set up proper backup strategies
3. Monitor database performance

## 9. Security Considerations

- ✅ JWT tokens for authentication
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Environment variable security

## 10. Performance Optimization

- ✅ Database indexes for queries
- ✅ Connection pooling
- ✅ Caching strategies
- ✅ Frontend code splitting
- ✅ Image optimization

The application is now fully integrated and ready for use! 

If you **still get the CORS error after adding `http://localhost:8080` to your allowed origins and restarting the backend**, here are the most common reasons and how to fix them:

---

## 1. **Check Your CORS Middleware Placement**
- The CORS middleware **must be registered before any routes** in your Express app.
- Example (in `server.js`):
  ```js
  const cors = require('cors');
  // ... other imports

  // CORS middleware FIRST
  app.use(cors({ ...your config... }));

  // THEN your routes
  app.use('/api/transactions', transactionsRouter);
  ```

---

## 2. **Check for Typos or Spaces**
- Your `ALLOWED_ORIGINS` should be:
  ```
  http://localhost:3000,http://localhost:8080,http://localhost:5173
  ```
  - **No spaces** between URLs.
  - If you use `.env`, make sure it’s loaded (with `dotenv`).

---

## 3. **Log the Origin and Allowed Origins**
Add a `console.log(origin, allowedOrigins)` inside your CORS function to debug:
```js
app.use(cors({
  origin: function (origin, callback) {
    console.log('Request Origin:', origin);
    console.log('Allowed Origins:', allowedOrigins);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```
- This will show you what the backend is seeing as the request origin and what it thinks is allowed.

---

## 4. **Check for Multiple CORS Middlewares**
- Make sure you don’t have multiple `app.use(cors(...))` calls with conflicting configs.

---

## 5. **Restart the Backend**
- After any change to `.env` or code, **fully stop and restart** your backend server.

---

## 6. **Frontend Request**
- Make sure your frontend is actually running at `http://localhost:8080` (check the browser address bar).
- If you use a proxy (like Vite or Webpack), check its config.

---

## 7. **Preflight (OPTIONS) Requests**
- Some requests (like POST with JSON) trigger a preflight `OPTIONS` request. Your backend must respond to these.
- The CORS middleware should handle this automatically if placed correctly.

---

## 8. **Share Your CORS Code**
If you’re still stuck, please **copy and paste your actual CORS setup code** (from `server.js` or wherever you set up Express and CORS).  
That will help me spot any subtle issues.

---

### **Summary Checklist**
- [ ] CORS middleware is before all routes
- [ ] No typos or spaces in `ALLOWED_ORIGINS`
- [ ] Backend restarted after changes
- [ ] Logging shows correct origin and allowed list
- [ ] Only one CORS middleware
- [ ] Frontend is at `http://localhost:8080`

---

**If you paste your CORS config here, I’ll review it and help you fix it fast!** 