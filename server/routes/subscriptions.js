const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get current subscription status
router.get('/current', authenticateToken, async (req, res, next) => {
  try {
    const sub = await db('subscriptions')
      .where({ organization_id: req.user.organization_id })
      .first();
    
    if (!sub) return res.status(404).json({ error: 'No subscription found' });
    res.json(sub);
  } catch (err) {
    next(err);
  }
});

// Mock checkout endpoint
router.post('/checkout', authenticateToken, async (req, res, next) => {
  try {
    const { plan, payment_method } = req.body;
    
    // In a real scenario, this would call Stripe API or Somali mobile money API.
    // We will just update the subscription directly for demo purposes.
    const currentEnd = new Date();
    currentEnd.setMonth(currentEnd.getMonth() + 1); // Mock 1 month sub

    await db('subscriptions')
      .where({ organization_id: req.user.organization_id })
      .update({
        plan: plan,
        status: 'active',
        payment_method: payment_method,
        current_period_end: currentEnd,
        updated_at: db.fn.now()
      });

    res.json({ success: true, message: 'Subscription upgraded successfully!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
