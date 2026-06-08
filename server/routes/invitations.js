const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validate');

// Generate an invite (Protected: Only Owner/Manager can invite)
router.post('/', authenticateToken, validate([
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('role').isIn(['admin', 'manager', 'tenant']).withMessage('Invalid role invitation'),
  body('unit_id').optional({ nullable: true }).isUUID().withMessage('Invalid unit ID format')
]), async (req, res, next) => {
  try {
    const { email, role, unit_id } = req.body;
    
    if (req.user.role === 'tenant') {
      return res.status(403).json({ error: 'Tenants cannot send invitations.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    await db('invitations').insert({
      id: token,
      organization_id: req.user.organization_id,
      email,
      role,
      unit_id: unit_id || null,
      invited_by: req.user.id,
      expires_at: expiresAt
    });

    res.status(201).json({ 
      message: 'Invitation generated successfully', 
      token,
      link: `${process.env.APP_URL || 'http://localhost:5173'}/accept-invite/${token}`
    });
  } catch (error) {
    next(error);
  }
});

// Validate an invite token (Public)
router.get('/:token', async (req, res, next) => {
  try {
    const invite = await db('invitations').where({ id: req.params.token }).first();
    
    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found or invalid.' });
    }
    
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: `Invitation has already been ${invite.status}.` });
    }
    
    if (new Date() > new Date(invite.expires_at)) {
      return res.status(400).json({ error: 'Invitation has expired.' });
    }

    const org = await db('organizations').where({ id: invite.organization_id }).first();

    res.json({
      email: invite.email,
      role: invite.role,
      organization_name: org ? org.name : 'an organization'
    });
  } catch (error) {
    next(error);
  }
});

// Accept an invite (Public)
router.post('/:token/accept', validate([
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional().trim()
]), async (req, res, next) => {
  try {
    const { full_name, password, phone } = req.body;
    const token = req.params.token;

    const invite = await db('invitations').where({ id: token, status: 'pending' }).first();
    if (!invite || new Date() > new Date(invite.expires_at)) {
      return res.status(400).json({ error: 'Invalid or expired invitation.' });
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email: invite.email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // Create the user
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const newUserId = uuidv4();
    const newUser = {
      id: newUserId,
      organization_id: invite.organization_id,
      email: invite.email,
      password_hash,
      role: invite.role,
      full_name,
      phone,
      status: 'active'
    };

    await db.transaction(async trx => {
      // 1. Insert user
      await trx('users').insert(newUser);
      
      // 2. If tenant, setup tenant profile and assign to unit
      if (invite.role === 'tenant') {
        const newTenantId = uuidv4();
        await trx('tenants').insert({
          id: newTenantId,
          organization_id: invite.organization_id,
          user_id: newUserId,
          full_name,
          email: invite.email,
          phone
        });

        if (invite.unit_id) {
          await trx('units')
            .where({ id: invite.unit_id, organization_id: invite.organization_id })
            .update({ tenant_id: newTenantId, status: 'occupied' });
        }
      }

      // 3. Mark invite as accepted
      await trx('invitations').where({ id: token }).update({ status: 'accepted' });
    });

    // Auto-login after acceptance
    const jwtToken = jwt.sign({ 
      id: newUser.id, 
      role: newUser.role, 
      email: newUser.email,
      organization_id: newUser.organization_id 
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Invitation accepted successfully.',
      token: jwtToken, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        full_name: newUser.full_name, 
        organization_id: newUser.organization_id 
      } 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
