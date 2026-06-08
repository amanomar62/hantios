const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

// Get maintenance requests
router.get('/', async (req, res, next) => {
  try {
    let query = db('maintenance_requests').where({ organization_id: req.user.organization_id });
    if (req.user.role === 'tenant') {
      const tenant = await db('tenants').where({ user_id: req.user.id, organization_id: req.user.organization_id }).first();
      if (tenant) {
        query = query.andWhere({ tenant_id: tenant.id });
      } else {
        return res.json([]);
      }
    }
    const requests = await query;
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// Create maintenance request
router.post('/', validate([
  body('property_id').isUUID().withMessage('Invalid property ID format'),
  body('unit_id').isUUID().withMessage('Invalid unit ID format'),
  body('title').trim().notEmpty().withMessage('Issue title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
  body('photos').optional().isArray().withMessage('Photos must be an array')
]), async (req, res, next) => {
  try {
    let tenant_id = req.body.tenant_id || null;
    
    // Security check: If submitting user is a tenant, they must have a valid profile
    if (req.user.role === 'tenant') {
      const tenant = await db('tenants')
        .where({ user_id: req.user.id, organization_id: req.user.organization_id })
        .first();
      if (!tenant) {
        return res.status(403).json({ 
          error: 'Access denied. You must have an active tenant profile associated with this account to submit maintenance requests.' 
        });
      }
      tenant_id = tenant.id;
    }

    const newRequest = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      tenant_id,
      unit_id: req.body.unit_id,
      property_id: req.body.property_id,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 'low',
      status: 'open',
      photos: JSON.stringify(req.body.photos || [])
    };
    
    await db('maintenance_requests').insert(newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
});

// Update maintenance request
router.put('/:id', validate([
  body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status value'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
  body('photos').optional().isArray().withMessage('Photos must be an array')
]), async (req, res, next) => {
  try {
    const updateData = { updated_at: db.fn.now() };
    
    const allowed = ['status', 'priority', 'assigned_to'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    });

    if (req.body.photos && Array.isArray(req.body.photos)) {
      updateData.photos = JSON.stringify(req.body.photos);
    }
    
    const count = await db('maintenance_requests')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .update(updateData);
      
    if (count === 0) return res.status(404).json({ error: 'Request not found' });
    
    const updated = await db('maintenance_requests')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .first();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Add comment
router.post('/:id/comments', validate([
  body('comment').trim().notEmpty().withMessage('Comment text cannot be empty')
]), async (req, res, next) => {
  try {
    const ticket = await db('maintenance_requests')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .first();
    if (!ticket) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    const newComment = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      maintenance_id: req.params.id,
      user_id: req.user.id,
      comment: req.body.comment
    };
    
    await db('comments').insert(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// Get comments
router.get('/:id/comments', async (req, res, next) => {
  try {
    const ticket = await db('maintenance_requests')
      .where({ id: req.params.id, organization_id: req.user.organization_id })
      .first();
    if (!ticket) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    const comments = await db('comments').where({ 
      maintenance_id: req.params.id,
      organization_id: req.user.organization_id 
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
