# SolSwap Backend

Express.js backend for SolSwap with Supabase integration.

## Features

- 🔐 User authentication with Supabase Auth
- 💾 Transaction management with Supabase Database
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)
- 📊 API endpoints for transactions and user management
- 🔄 Real-time data with Supabase

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Fill in your Supabase credentials and other configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Supabase Database Setup

Create the following tables in your Supabase database:

#### Users Table (Auto-created by Supabase Auth)
```sql
-- This is automatically created by Supabase Auth
-- You can extend it with additional columns if needed
```

#### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  from_token TEXT NOT NULL,
  to_token TEXT NOT NULL,
  from_amount DECIMAL NOT NULL,
  to_amount DECIMAL NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  fee_amount DECIMAL DEFAULT 0,
  slippage DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for recent transactions (optional)
CREATE POLICY "Public can view recent transactions" ON transactions
  FOR SELECT USING (true);
```

### 4. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "wallet_address": "optional_wallet_address"
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/logout`
Logout user.

#### GET `/api/auth/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT `/api/auth/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "wallet_address": "new_wallet_address"
}
```

### Transactions

#### GET `/api/transactions/recent`
Get recent transactions (public).

#### GET `/api/transactions/user`
Get user's transactions.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST `/api/transactions`
Create new transaction.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "from_token": "SOL",
  "to_token": "USDC",
  "from_amount": "1.5",
  "to_amount": "150.00",
  "tx_hash": "transaction_hash",
  "status": "pending",
  "fee_amount": "0.1",
  "slippage": "0.5"
}
```

#### PATCH `/api/transactions/:id`
Update transaction status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed",
  "tx_hash": "updated_transaction_hash"
}
```

#### GET `/api/transactions/:id`
Get transaction by ID.

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Joi validation
- **Authentication**: JWT tokens with Supabase

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Development

### Project Structure
```
backend/
├── config/
│   └── supabase.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   └── transactions.js
├── server.js
├── package.json
├── env.example
└── README.md
```

### Adding New Routes

1. Create a new route file in `routes/`
2. Import and use it in `server.js`
3. Add appropriate middleware and validation

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `JWT_SECRET`: JWT secret for token signing
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production Supabase credentials
3. Set appropriate CORS origins
4. Configure rate limiting for production

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start server.js --name "solswap-backend"
pm2 save
pm2 startup
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 