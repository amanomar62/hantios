const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

router.get('/messages', async (req, res, next) => {
  try {
    const messages = await db('messages')
      .where({ organization_id: req.user.organization_id })
      .andWhere(function() {
        this.where({ sender_id: req.user.id })
            .orWhere({ receiver_id: req.user.id });
      })
      .orderBy('created_at', 'asc');
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

router.post('/messages', validate([
  body('receiver_id').isUUID().withMessage('Invalid receiver ID format'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
  body('attachments').optional().isArray().withMessage('Attachments must be an array')
]), async (req, res, next) => {
  try {
    const newMessage = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      sender_id: req.user.id,
      receiver_id: req.body.receiver_id,
      content: req.body.content,
      attachments: JSON.stringify(req.body.attachments || []),
      read_receipt: false
    };
    
    await db('messages').insert(newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
