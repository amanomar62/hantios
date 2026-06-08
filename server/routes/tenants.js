const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

// Get all tenants
router.get('/', async (req, res, next) => {
  try {
    const tenants = await db('tenants').where({ organization_id: req.user.organization_id });
    res.json(tenants);
  } catch (error) {
    next(error);
  }
});

// Get single tenant
router.get('/:id', async (req, res, next) => {
  try {
    const tenant = await db('tenants').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    next(error);
  }
});

// Create tenant
router.post('/', requireRole(['admin', 'owner', 'manager']), validate([
  body('full_name').trim().notEmpty().withMessage('Tenant full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('phone').optional().trim(),
  body('national_id').optional().trim(),
  body('emergency_contact').optional().trim(),
  body('documents').optional().isArray().withMessage('Documents must be an array'),
  body('user_id').optional({ nullable: true }).isUUID().withMessage('Invalid user ID format')
]), async (req, res, next) => {
  try {
    const newTenant = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      user_id: req.body.user_id || null,
      full_name: req.body.full_name,
      phone: req.body.phone || '',
      email: req.body.email,
      national_id: req.body.national_id || '',
      emergency_contact: req.body.emergency_contact || '',
      documents: JSON.stringify(req.body.documents || [])
    };
    
    await db('tenants').insert(newTenant);
    res.status(201).json(newTenant);
  } catch (error) {
    next(error);
  }
});

// Update tenant
router.put('/:id', requireRole(['admin', 'owner', 'manager']), validate([
  body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('phone').optional().trim(),
  body('national_id').optional().trim(),
  body('emergency_contact').optional().trim(),
  body('documents').optional().isArray().withMessage('Documents must be an array')
]), async (req, res, next) => {
  try {
    const allowed = ['full_name', 'email', 'phone', 'national_id', 'emergency_contact', 'documents'];
    const updateData = { updated_at: db.fn.now() };
    
    allowed.forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'documents' && Array.isArray(req.body[key])) {
          updateData[key] = JSON.stringify(req.body[key]);
        } else {
          updateData[key] = req.body[key];
        }
      }
    });
    
    const count = await db('tenants')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .update(updateData);
      
    if (count === 0) return res.status(404).json({ error: 'Tenant not found' });
    
    const updated = await db('tenants').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
