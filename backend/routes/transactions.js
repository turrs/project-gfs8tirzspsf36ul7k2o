const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateUser, optionalAuth } = require('../middleware/auth');
const router = express.Router();
const cors = require('cors');

// Get recent transactions (public)
router.get('/recent', optionalAuth, async (req, res) => {
  try {
    const { wallet_address } = req.query;
    let query = supabase
      .from('transactions')
      .select(`
        *
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (wallet_address) {
      query = query.eq('wallet_address', wallet_address);
    }

    const { data, error } = await query;
    if (error) throw error;

    // In the GET /recent route, if 'status' is included in the response, filter it out before sending the transactions array.
    const transactions = data.map(tx => {
      const { status, ...rest } = tx;
      return rest;
    });

    res.json({ transactions: transactions || [] });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get user's transactions
router.get('/user', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        from_token:symbol,
        to_token:symbol
      `)
      .eq('wallet_address', req.user.wallet_address)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ transactions: data || [] });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ error: 'Failed to fetch user transactions' });
  }
});

// Create new transaction (no auth required)
router.post('/', async (req, res) => {
  console.log('Creating transaction with wewewew:', req.body);
  try {
    const {
      from_token,
      to_token,
      from_amount,
      to_amount,
      tx_hash,
      fee_amount,
      slippage,
      wallet_address
    } = req.body;

    console.log('Creating transaction with data:', {
      wallet_address,
      from_token,
      to_token,
      from_amount,
      to_amount,
      tx_hash,
      fee_amount,
      slippage
    });

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        wallet_address,
        from_token,
        to_token,
        from_amount,
        to_amount,
        tx_hash,
        fee_amount,
        slippage,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Transaction created successfully:', data);
    res.status(201).json({ 
      success: true,
      transaction: data 
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create transaction',
      details: error.message 
    });
  }
});

// Update transaction status
router.patch('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tx_hash } = req.body;

    const { data, error } = await supabase
      .from('transactions')
      .update({
        status,
        tx_hash,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('wallet_address', req.user.wallet_address)
      .select()
      .single();

    if (error) throw error;

    res.json({ transaction: data });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Get transaction by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        from_token:symbol,
        to_token:symbol
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ transaction: data });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Test database connection
router.get('/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('count')
      .limit(1);

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Database connection successful',
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

module.exports = router; 