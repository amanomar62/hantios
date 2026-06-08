const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticateToken);

// Get monthly expected vs collected stats for last 6 months
router.get('/stats', requireRole(['admin', 'owner', 'manager']), async (req, res, next) => {
  try {
    const orgId = req.user.organization_id;
    
    // Aggregate expected & collected amounts grouped by month of due_date
    const stats = await db('invoices')
      .where({ organization_id: orgId })
      .select(
        db.raw("strftime('%Y-%m', due_date) as month"),
        db.raw("SUM(amount) as expected"),
        db.raw("SUM(paid_amount) as collected")
      )
      .groupBy('month')
      .orderBy('month', 'asc');

    // Fill in last 6 months dynamically (so there are no missing data points on Recharts)
    const result = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const name = monthNames[d.getMonth()];
      
      const found = stats.find(s => s.month === yearMonth);
      result.push({
        name,
        month: yearMonth,
        expected: found ? parseFloat(found.expected || 0) : 0,
        collected: found ? parseFloat(found.collected || 0) : 0
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get all invoices with rich context
router.get('/invoices', async (req, res, next) => {
  try {
    let query = db('invoices')
      .join('units', 'invoices.unit_id', 'units.id')
      .join('properties', 'units.property_id', 'properties.id')
      .leftJoin('tenants', 'invoices.tenant_id', 'tenants.id')
      .where('invoices.organization_id', req.user.organization_id)
      .select(
        'invoices.*',
        'units.unit_number as unit_name',
        'properties.name as property_name',
        'tenants.full_name as tenant_name'
      );

    if (req.user.role === 'tenant') {
      const tenant = await db('tenants')
        .where({ user_id: req.user.id, organization_id: req.user.organization_id })
        .first();
      if (tenant) {
        query = query.where('invoices.tenant_id', tenant.id);
      } else {
        return res.json([]);
      }
    }

    const invoices = await query.orderBy('invoices.due_date', 'desc');
    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

// Auto-generate monthly invoices for all occupied units
router.post('/invoices/generate', requireRole(['admin', 'owner', 'manager']), async (req, res, next) => {
  try {
    const orgId = req.user.organization_id;
    
    // Find all occupied units that have a tenant assigned
    const occupiedUnits = await db('units')
      .where({ organization_id: orgId, status: 'occupied' })
      .whereNotNull('tenant_id');

    const newInvoices = [];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dueDateStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`;

    for (const unit of occupiedUnits) {
      newInvoices.push({
        id: uuidv4(),
        organization_id: orgId,
        unit_id: unit.id,
        tenant_id: unit.tenant_id,
        amount: unit.monthly_rent,
        due_date: dueDateStr,
        status: 'pending',
        invoice_number: `INV-${unit.unit_number}-${Date.now().toString().slice(-4)}`
      });
    }

    if (newInvoices.length > 0) {
      await db('invoices').insert(newInvoices);
    }

    res.status(201).json({ message: `Generated ${newInvoices.length} invoices`, count: newInvoices.length });
  } catch (error) {
    next(error);
  }
});

// Record a payment (Tenant Pay Now / Manual)
router.post('/pay/:invoiceId', validate([
  body('amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be a positive number'),
  body('payment_method').optional().isIn(['cash', 'bank_transfer', 'check', 'credit_card']).withMessage('Invalid payment method')
]), async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId;
    const orgId = req.user.organization_id;

    await db.transaction(async trx => {
      const invoice = await trx('invoices')
        .where({ id: invoiceId, organization_id: orgId })
        .first();
      
      if (!invoice) throw new Error("Invoice not found or unauthorized access.");

      const paymentAmount = req.body.amount || invoice.amount;
      
      const newPayment = {
        id: uuidv4(),
        organization_id: orgId,
        invoice_id: invoice.id,
        amount: paymentAmount,
        payment_method: req.body.payment_method || 'credit_card',
        transaction_reference: `TXN-${uuidv4().split('-')[0]}`,
        payment_date: new Date().toISOString().split('T')[0]
      };
      
      await trx('payments').insert(newPayment);
      
      const newPaidAmount = parseFloat(invoice.paid_amount || 0) + parseFloat(paymentAmount);
      let newStatus = 'partial';
      if (newPaidAmount >= parseFloat(invoice.amount)) {
        newStatus = 'paid';
      }
      
      await trx('invoices')
        .where({ id: invoice.id })
        .update({
          paid_amount: newPaidAmount,
          status: newStatus
        });
    });

    res.status(200).json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
