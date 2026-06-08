const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

router.get('/', async (req, res, next) => {
  try {
    const notifications = await db('notifications')
      .where({ user_id: req.user.id, organization_id: req.user.organization_id })
      .orderBy('created_at', 'desc');
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

router.post('/', validate([
  body('user_id').isUUID().withMessage('Invalid target user ID format'),
  body('title').trim().notEmpty().withMessage('Notification title is required'),
  body('message').trim().notEmpty().withMessage('Notification message is required'),
  body('type').optional().trim()
]), async (req, res, next) => {
  try {
    const newNotification = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      user_id: req.body.user_id,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || 'info',
      read_status: false
    };
    await db('notifications').insert(newNotification);
    res.status(201).json(newNotification);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    const count = await db('notifications')
      .where({ id: req.params.id, user_id: req.user.id, organization_id: req.user.organization_id })
      .update({ read_status: true, updated_at: db.fn.now() });
      
    if (count === 0) return res.status(404).json({ error: 'Notification not found' });
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
