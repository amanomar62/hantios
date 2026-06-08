const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

// Dashboard Stats — real aggregated numbers
router.get('/stats', async (req, res, next) => {
  try {
    const orgId = req.user.organization_id;

    const properties = await db('properties').where({ organization_id: orgId });
    const units = await db('units').where({ organization_id: orgId });
    const openMaintenance = await db('maintenance_requests').where({ organization_id: orgId, status: 'open' });
    
    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.status === 'occupied').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    const monthlyRevenue = units
      .filter(u => u.status === 'occupied')
      .reduce((sum, u) => sum + parseFloat(u.monthly_rent || 0), 0);

    res.json({
      totalProperties: properties.length,
      totalUnits,
      occupiedUnits,
      vacantUnits: totalUnits - occupiedUnits,
      occupancyRate,
      monthlyRevenue,
      openMaintenanceCount: openMaintenance.length
    });
  } catch (error) {
    next(error);
  }
});

// Get all properties
router.get('/', async (req, res, next) => {
  try {
    let properties;
    if (req.user.role === 'owner') {
      properties = await db('properties').where({ owner_id: req.user.id, organization_id: req.user.organization_id });
    } else {
      properties = await db('properties').where({ organization_id: req.user.organization_id });
    }
    res.json(properties);
  } catch (error) {
    next(error);
  }
});

// Get a single property
router.get('/:id', async (req, res, next) => {
  try {
    const property = await db('properties').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    // Also fetch units
    const units = await db('units').where({ property_id: property.id, organization_id: req.user.organization_id });
    property.units = units;
    
    res.json(property);
  } catch (error) {
    next(error);
  }
});

// Create property
router.post('/', requireRole(['admin', 'owner', 'manager']), validate([
  body('name').trim().notEmpty().withMessage('Property name is required'),
  body('type').optional().isIn(['residential', 'commercial', 'mixed']).withMessage('Invalid property type'),
  body('address').trim().notEmpty().withMessage('Property address is required'),
  body('description').optional().trim(),
  body('photos').optional().isArray().withMessage('Photos must be an array')
]), async (req, res, next) => {
  try {
    const newProperty = {
      id: uuidv4(),
      name: req.body.name,
      type: req.body.type || 'residential',
      address: req.body.address,
      description: req.body.description || '',
      photos: JSON.stringify(req.body.photos || []),
      units_count: req.body.units_count || 0,
      owner_id: req.body.owner_id || req.user.id,
      organization_id: req.user.organization_id
    };
    
    await db('properties').insert(newProperty);
    res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
});

// Update property
router.put('/:id', requireRole(['admin', 'owner', 'manager']), validate([
  body('name').optional().trim().notEmpty().withMessage('Property name cannot be empty'),
  body('type').optional().isIn(['residential', 'commercial', 'mixed']).withMessage('Invalid property type'),
  body('address').optional().trim().notEmpty().withMessage('Property address cannot be empty'),
  body('description').optional().trim(),
  body('photos').optional().isArray().withMessage('Photos must be an array')
]), async (req, res, next) => {
  try {
    const updateData = {
      updated_at: db.fn.now()
    };
    
    const allowedFields = ['name', 'type', 'address', 'description', 'units_count'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (req.body.photos) {
      updateData.photos = JSON.stringify(req.body.photos);
    }
    
    const count = await db('properties')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .update(updateData);
      
    if (count === 0) return res.status(404).json({ error: 'Property not found' });
    
    const updated = await db('properties').where({ id: req.params.id, organization_id: req.user.organization_id }).first();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete property
router.delete('/:id', requireRole(['admin', 'owner']), async (req, res, next) => {
  try {
    const count = await db('properties').where({ id: req.params.id, organization_id: req.user.organization_id }).del();
    if (count === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
