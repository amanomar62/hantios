const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

// User Registration (Owners only)
router.post('/register', validate([
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['owner']).withMessage('Only owners can register directly.'),
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('company_name').optional().trim(),
  body('phone').optional().trim()
]), async (req, res, next) => {
  try {
    const { email, password, role, full_name, company_name, phone } = req.body;
    
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const orgId = uuidv4();
    const subId = uuidv4();

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const newUserId = uuidv4();

    await db.transaction(async (trx) => {
      await trx('organizations').insert({
        id: orgId,
        name: company_name || `${full_name}'s Workspace`
      });

      await trx('subscriptions').insert({
        id: subId,
        organization_id: orgId,
        plan: 'free_trial',
        status: 'trialing',
        trial_ends_at: trialEndsAt,
        current_period_end: trialEndsAt
      });

      await trx('organizations').where({ id: orgId }).update({
        subscription_id: subId
      });

      await trx('users').insert({
        id: newUserId,
        organization_id: orgId,
        email,
        password_hash,
        role,
        full_name,
        phone,
        status: 'active'
      });
    });
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: newUserId, email, role, organization_id: orgId } 
    });
  } catch (error) {
    next(error);
  }
});

// User Login
router.post('/login', validate([
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
]), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ 
      id: user.id, 
      role: user.role, 
      email: user.email,
      organization_id: user.organization_id 
    }, JWT_SECRET, { expiresIn: '24h' });

    res.cookie('hantios_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        full_name: user.full_name, 
        organization_id: user.organization_id 
      } 
    });
  } catch (error) {
    next(error);
  }
});

// User Logout
router.post('/logout', (req, res) => {
  res.clearCookie('hantios_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

// Get currently logged-in user profile
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    delete user.password_hash;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get all users in the same organization
router.get('/users', authenticateToken, async (req, res, next) => {
  try {
    const users = await db('users')
      .where({ organization_id: req.user.organization_id })
      .andWhereNot({ id: req.user.id })
      .select('id', 'email', 'role', 'full_name', 'phone', 'avatar_url', 'status');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', authenticateToken, validate([
  body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('phone').optional().trim(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]), async (req, res, next) => {
  try {
    const { full_name, phone, password } = req.body;
    const updateData = { updated_at: db.fn.now() };

    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    await db('users').where({ id: req.user.id }).update(updateData);
    
    const updatedUser = await db('users').where({ id: req.user.id }).first();
    delete updatedUser.password_hash;
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
