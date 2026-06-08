const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('documents').del();
  await knex('messages').del();
  await knex('notifications').del();
  await knex('comments').del();
  await knex('maintenance_requests').del();
  await knex('payments').del();
  await knex('invoices').del();
  await knex('units').del();
  await knex('tenants').del();
  await knex('properties').del();
  await knex('organizations').update({ subscription_id: null });
  await knex('subscriptions').del();
  await knex('users').del();
  await knex('organizations').del();
  await knex('organizations').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  const orgId = 'WS-001';
  const subId1 = uuidv4();
  const subId2 = uuidv4();
  const subId3 = uuidv4();
  const subId4 = uuidv4();

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await knex('organizations').insert([
    { id: orgId, name: 'Ahmed Properties' },
    { id: 'WS-002', name: 'Mogadishu Rentals' },
    { id: 'WS-003', name: 'Hargeisa Estates' },
    { id: 'WS-004', name: 'Garowe Homes' }
  ]);

  await knex('subscriptions').insert([
    { id: subId1, organization_id: orgId, plan: 'professional', status: 'active', current_period_end: nextMonth },
    { id: subId2, organization_id: 'WS-002', plan: 'growth', status: 'active', current_period_end: nextMonth },
    { id: subId3, organization_id: 'WS-003', plan: 'starter', status: 'active', current_period_end: nextMonth },
    { id: subId4, organization_id: 'WS-004', plan: 'free_trial', status: 'trialing', current_period_end: nextMonth }
  ]);

  await knex('organizations').where({ id: orgId }).update({ subscription_id: subId1 });
  await knex('organizations').where({ id: 'WS-002' }).update({ subscription_id: subId2 });
  await knex('organizations').where({ id: 'WS-003' }).update({ subscription_id: subId3 });
  await knex('organizations').where({ id: 'WS-004' }).update({ subscription_id: subId4 });

  const adminId = uuidv4();
  const ownerId = uuidv4();
  const managerId = uuidv4();
  const tenantUserId = uuidv4();

  await knex('users').insert([
    { id: adminId, organization_id: orgId, email: 'admin@hantios.com', password_hash: passwordHash, role: 'admin', full_name: 'System Admin', status: 'active' },
    { id: ownerId, organization_id: orgId, email: 'owner@hantios.com', password_hash: passwordHash, role: 'owner', full_name: 'Property Owner', status: 'active' },
    { id: managerId, organization_id: orgId, email: 'manager@hantios.com', password_hash: passwordHash, role: 'manager', full_name: 'Property Manager', status: 'active' },
    { id: tenantUserId, organization_id: orgId, email: 'tenant@hantios.com', password_hash: passwordHash, role: 'tenant', full_name: 'John Doe Tenant', status: 'active' }
  ]);

  const propId1 = uuidv4();
  await knex('properties').insert([
    { id: propId1, organization_id: orgId, name: 'Sunset Apartments', type: 'residential', address: '123 Sunset Blvd', units_count: 10, owner_id: ownerId, description: 'Beautiful apartments', photos: '[]' }
  ]);

  const tenantId = uuidv4();
  await knex('tenants').insert([
    { id: tenantId, organization_id: orgId, user_id: tenantUserId, full_name: 'John Doe', phone: '1234567890', email: 'tenant@hantios.com', national_id: 'NID12345', documents: '[]' }
  ]);

  const unitId1 = uuidv4();
  const unitId2 = uuidv4();
  await knex('units').insert([
    { id: unitId1, organization_id: orgId, property_id: propId1, unit_number: '101', floor: '1', status: 'occupied', monthly_rent: 1500, deposit_amount: 1500, tenant_id: tenantId, lease_start_date: '2023-01-01', lease_end_date: '2024-01-01' },
    { id: unitId2, organization_id: orgId, property_id: propId1, unit_number: '102', floor: '1', status: 'vacant', monthly_rent: 1600, deposit_amount: 1600 }
  ]);

  const invoiceId1 = uuidv4();
  const invoiceId2 = uuidv4();
  await knex('invoices').insert([
    { id: invoiceId1, organization_id: orgId, unit_id: unitId1, tenant_id: tenantId, amount: 1500, due_date: '2023-05-01', status: 'paid', paid_amount: 1500, invoice_number: 'INV-001' },
    { id: invoiceId2, organization_id: orgId, unit_id: unitId1, tenant_id: tenantId, amount: 1500, due_date: '2023-06-01', status: 'overdue', paid_amount: 0, invoice_number: 'INV-002' }
  ]);

  await knex('payments').insert([
    { id: uuidv4(), organization_id: orgId, invoice_id: invoiceId1, amount: 1500, payment_method: 'bank_transfer', transaction_reference: 'TXN123', payment_date: '2023-04-28' }
  ]);

  const maintId = uuidv4();
  await knex('maintenance_requests').insert([
    { id: maintId, organization_id: orgId, tenant_id: tenantId, unit_id: unitId1, property_id: propId1, title: 'Leaking Faucet', description: 'The kitchen sink is leaking', priority: 'medium', status: 'open', photos: '[]' }
  ]);

  await knex('messages').insert([
    { id: uuidv4(), organization_id: orgId, sender_id: tenantUserId, receiver_id: managerId, content: 'Hi, when will the plumber arrive?', attachments: '[]' },
    { id: uuidv4(), organization_id: orgId, sender_id: managerId, receiver_id: tenantUserId, content: 'He should be there tomorrow morning.', attachments: '[]' }
  ]);
};
