const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const validate = require('../middleware/validate');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.use(authenticateToken);

router.get('/', async (req, res, next) => {
  try {
    const documents = await db('documents').where({ organization_id: req.user.organization_id });
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.single('file'), validate([
  body('property_id').optional({ nullable: true }).isUUID().withMessage('Invalid property ID format'),
  body('unit_id').optional({ nullable: true }).isUUID().withMessage('Invalid unit ID format'),
  body('tenant_id').optional({ nullable: true }).isUUID().withMessage('Invalid tenant ID format'),
  body('name').optional().trim(),
  body('version').optional().trim()
]), async (req, res, next) => {
  try {
    const newDocument = {
      id: uuidv4(),
      organization_id: req.user.organization_id,
      property_id: req.body.property_id || null,
      unit_id: req.body.unit_id || null,
      tenant_id: req.body.tenant_id || null,
      name: req.body.name || req.file?.originalname || 'Unnamed Document',
      type: req.body.type || req.file?.mimetype || 'unknown',
      file_url: req.file ? `/uploads/${req.file.filename}` : null,
      size: req.file?.size || 0,
      uploaded_by: req.user.id,
      version: req.body.version || '1.0'
    };
    
    await db('documents').insert(newDocument);
    res.status(201).json(newDocument);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
