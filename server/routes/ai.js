const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.use(authenticateToken);

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

router.post('/query', validate([
  body('query').trim().notEmpty().withMessage('Query is required')
]), async (req, res, next) => {
  try {
    const { query } = req.body;

    let intent = 'unknown';

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a helpful AI assistant for a property management system. 
      Analyze the following user query and map it to exactly one of these intents:
      - "fetch_overdue_invoices" (e.g., who owes me money, unpaid rent, overdue)
      - "fetch_vacant_units" (e.g., empty apartments, vacant units, what is available)
      - "fetch_open_maintenance" (e.g., broken pipes, open requests, plumbing issues)
      - "unknown" (if it doesn't match any of the above)

      Return only a JSON object like {"intent": "the_intent_here"}.
      
      User Query: "${query}"`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        intent = parsed.intent || 'unknown';
      } catch (err) {
        console.error("Failed to parse Gemini response:", err, text);
        intent = 'unknown';
      }
    } else {
      // Fallback if no API key is provided
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('overdue rent') || lowerQuery.includes('overdue invoices')) intent = 'fetch_overdue_invoices';
      else if (lowerQuery.includes('vacant units')) intent = 'fetch_vacant_units';
      else if (lowerQuery.includes('open maintenance') || lowerQuery.includes('maintenance request')) intent = 'fetch_open_maintenance';
    }

    if (intent === 'fetch_overdue_invoices') {
      const overdueInvoices = await db('invoices').where({ status: 'overdue', organization_id: req.user.organization_id });
      return res.json({
        intent,
        message: `Found ${overdueInvoices.length} overdue invoices.`,
        data: overdueInvoices
      });
    }

    if (intent === 'fetch_vacant_units') {
      const vacantUnits = await db('units').where({ status: 'vacant', organization_id: req.user.organization_id });
      return res.json({
        intent,
        message: `Found ${vacantUnits.length} vacant units.`,
        data: vacantUnits
      });
    }

    if (intent === 'fetch_open_maintenance') {
      const openRequests = await db('maintenance_requests').where({ status: 'open', organization_id: req.user.organization_id });
      return res.json({
        intent,
        message: `Found ${openRequests.length} open maintenance requests.`,
        data: openRequests
      });
    }

    return res.json({
      intent: 'unknown',
      message: 'I did not understand the query. Try asking for "overdue rent", "vacant units", or "open maintenance requests".',
      data: []
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
