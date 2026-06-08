const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Apply admin role security to all admin endpoints
router.use(authenticateToken, requireRole(['admin']));

// Get overall platform stats
router.get('/stats', async (req, res, next) => {
  try {
    const orgCount = await db('organizations').count('id as count').first();
    const userCount = await db('users').count('id as count').first();
    const propertyCount = await db('properties').count('id as count').first();
    
    // Calculate SaaS Revenue (Sum of plans)
    const activeSubs = await db('subscriptions').where({ status: 'active' }).orWhere({ status: 'trialing' });
    const planPrices = {
      free_trial: 0,
      starter: 49,
      growth: 99,
      professional: 199,
      enterprise: 499
    };
    
    let totalMRR = 0;
    activeSubs.forEach(sub => {
      totalMRR += planPrices[sub.plan] || 0;
    });

    res.json({
      organizations: orgCount.count || 0,
      users: userCount.count || 0,
      properties: propertyCount.count || 0,
      mrr: totalMRR,
      system: {
        uptime: process.uptime(),
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        dbSize: '152 KB' // approximate dev.sqlite3 file size
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get all organizations with subscription info
router.get('/organizations', async (req, res, next) => {
  try {
    const orgs = await db('organizations')
      .leftJoin('subscriptions', 'organizations.id', 'subscriptions.organization_id')
      .select(
        'organizations.id',
        'organizations.name',
        'organizations.created_at',
        'subscriptions.plan',
        'subscriptions.status as subscription_status',
        'subscriptions.current_period_end'
      );
    res.json(orgs);
  } catch (err) {
    next(err);
  }
});

// Toggle organization status (mock action)
router.post('/organizations/:id/toggle-status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await db('subscriptions').where({ organization_id: id }).first();
    
    let nextStatus = 'active';
    if (!sub) {
      // If no subscription exists, insert a mock one
      const uuidv4 = require('uuid').v4;
      const subId = uuidv4();
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      await db('subscriptions').insert({
        id: subId,
        organization_id: id,
        plan: 'free_trial',
        status: 'canceled', // start cancelled so toggle sets active
        trial_ends_at: trialEndsAt,
        current_period_end: trialEndsAt
      });
      nextStatus = 'active';
    } else {
      nextStatus = sub.status === 'active' ? 'canceled' : 'active';
      await db('subscriptions').where({ organization_id: id }).update({
        status: nextStatus,
        updated_at: db.fn.now()
      });
    }
    
    res.json({ success: true, newStatus: nextStatus });
  } catch (err) {
    next(err);
  }
});

// Get all users globally joined with their organization
router.get('/users', async (req, res, next) => {
  try {
    const users = await db('users')
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .select(
        'users.id',
        'users.full_name',
        'users.email',
        'users.role',
        'users.status',
        'users.created_at',
        'organizations.name as organization_name'
      );
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Toggle user status
router.post('/users/:id/toggle-status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db('users').where({ id }).first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    await db('users').where({ id }).update({
      status: nextStatus,
      updated_at: db.fn.now()
    });
    
    res.json({ success: true, newStatus: nextStatus });
  } catch (err) {
    next(err);
  }
});

// Get global AI logs & stats
router.get('/ai-logs', async (req, res, next) => {
  try {
    // Return mock system usage logs
    res.json({
      totalRequests: 1420,
      classificationRate: '94.5%',
      avgConfidence: '88.2%',
      tokenUsage: 354000,
      recentQueries: [
        { query: 'who has overdue rent?', classification: 'financial_inquiry', confidence: 0.92, timestamp: new Date() },
        { query: 'leaking pipes in unit 101', classification: 'maintenance_request', confidence: 0.98, timestamp: new Date(Date.now() - 5 * 60000) },
        { query: 'how many vacant units do we have?', classification: 'occupancy_inquiry', confidence: 0.89, timestamp: new Date(Date.now() - 15 * 60000) },
      ]
    });
  } catch (err) {
    next(err);
  }
});

// Get SaaS MRR over time chart data
router.get('/mrr-chart', async (req, res, next) => {
  try {
    // Return mock monthly historical SaaS platform MRR
    res.json([
      { name: 'Jan', expected: 80, collected: 80 },
      { name: 'Feb', expected: 120, collected: 120 },
      { name: 'Mar', expected: 250, collected: 200 },
      { name: 'Apr', expected: 350, collected: 350 },
      { name: 'May', expected: 500, collected: 450 },
      { name: 'Jun', expected: 750, collected: 750 },
    ]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
