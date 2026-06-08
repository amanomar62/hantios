const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

// Get all units for the workspace (organization)
router.get('/', async (req, res, next) => {
  try {
    const { property_id } = req.query;
    let query = db('units').where({ organization_id: req.user.organization_id });
    
    if (property_id) {
      query = query.andWhere({ property_id });
    }
    const units = await query;
    res.json(units);
  } catch (error) {
    next(error);
  }
});

// Get single unit
router.get('/:id', async (req, res, next) => {
  try {
    const unit = await db('units').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    res.json(unit);
  } catch (error) {
    next(error);
  }
});

// Create single unit
router.post('/', requireRole(['admin', 'owner', 'manager']), validate([
  body('property_id').isUUID().withMessage('Invalid property ID format'),
  body('unit_number').trim().notEmpty().withMessage('Unit number is required'),
  body('floor').trim().notEmpty().withMessage('Floor is required'),
  body('status').optional().isIn(['vacant', 'occupied', 'maintenance']).withMessage('Invalid status'),
  body('monthly_rent').isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number'),
  body('deposit_amount').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Deposit amount must be a positive number')
]), async (req, res, next) => {
  try {
    const { property_id, unit_number, floor, status, monthly_rent, deposit_amount } = req.body;
    
    // Verify property belongs to organization
    const property = await db('properties').where({ id: property_id, organization_id: req.user.organization_id }).first();
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const newUnit = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      property_id,
      unit_number,
      floor,
      status: status || 'vacant',
      monthly_rent,
      deposit_amount: deposit_amount || 0
    };
    
    await db('units').insert(newUnit);

    // Update property unit count
    await db('properties').where({ id: property_id }).update({
      units_count: (property.units_count || 0) + 1,
      updated_at: db.fn.now()
    });

    res.status(201).json(newUnit);
  } catch (error) {
    next(error);
  }
});

// Create bulk units
router.post('/bulk', requireRole(['admin', 'owner', 'manager']), validate([
  body('property_id').isUUID().withMessage('Invalid property ID format'),
  body('floors').isInt({ min: 1 }).withMessage('Floors must be at least 1'),
  body('units_per_floor').isInt({ min: 1 }).withMessage('Units per floor must be at least 1'),
  body('monthly_rent').optional().isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number'),
  body('deposit_amount').optional().isFloat({ min: 0 }).withMessage('Deposit amount must be a positive number')
]), async (req, res, next) => {
  try {
    const { property_id, floors, units_per_floor, monthly_rent, deposit_amount } = req.body;
    
    // Verify property belongs to organization
    const property = await db('properties').where({ id: property_id, organization_id: req.user.organization_id }).first();
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const newUnits = [];
    for (let f = 1; f <= floors; f++) {
      for (let u = 1; u <= units_per_floor; u++) {
        const unitNum = `${f}${u.toString().padStart(2, '0')}`; // e.g., 101, 102
        newUnits.push({
          id: uuidv4(),
          organization_id: req.user.organization_id,
          property_id,
          unit_number: unitNum,
          floor: f.toString(),
          status: 'vacant',
          monthly_rent: monthly_rent || 0,
          deposit_amount: deposit_amount || 0
        });
      }
    }
    
    if (newUnits.length > 0) {
      await db('units').insert(newUnits);
      // Update property unit count
      await db('properties').where({ id: property_id }).update({
        units_count: (property.units_count || 0) + newUnits.length,
        updated_at: db.fn.now()
      });
    }

    res.status(201).json({ message: `${newUnits.length} units created successfully`, units: newUnits });
  } catch (error) {
    next(error);
  }
});

// Update unit (allowlisted fields only - prevents mass assignment)
router.put('/:id', requireRole(['admin', 'owner', 'manager']), validate([
  body('unit_number').optional().trim().notEmpty().withMessage('Unit number cannot be empty'),
  body('floor').optional().trim().notEmpty().withMessage('Floor cannot be empty'),
  body('status').optional().isIn(['vacant', 'occupied', 'maintenance']).withMessage('Invalid status value'),
  body('monthly_rent').optional().isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number'),
  body('deposit_amount').optional().isFloat({ min: 0 }).withMessage('Deposit amount must be a positive number')
]), async (req, res, next) => {
  try {
    const allowed = ['unit_number', 'floor', 'status', 'monthly_rent', 'deposit_amount', 'lease_start_date', 'lease_end_date'];
    const updateData = { updated_at: db.fn.now() };
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    });
    
    const count = await db('units')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .update(updateData);
      
    if (count === 0) return res.status(404).json({ error: 'Unit not found' });
    
    const updated = await db('units').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete unit
router.delete('/:id', requireRole(['admin', 'owner']), async (req, res, next) => {
  try {
    const unit = await db('units').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    if (!unit) return res.status(404).json({ error: 'Unit not found' });

    await db.transaction(async trx => {
      await trx('units').where({ id: req.params.id }).del();
      // Decrement property unit count
      await trx('properties')
        .where({ id: unit.property_id })
        .decrement('units_count', 1);
    });

    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
