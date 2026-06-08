exports.up = function(knex) {
  return knex.schema
    .createTable('organizations', table => {
      table.string('id').primary();
      table.string('name').notNullable();
      // owner_id will be added later or we can leave it out if users belong to organizations
      table.timestamps(true, true);
    })
    .createTable('users', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.string('phone');
      table.string('role').notNullable(); // admin, owner, manager, tenant
      table.string('full_name');
      table.string('avatar_url');
      table.string('status');
      table.timestamps(true, true);
    })
    .createTable('properties', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('type');
      table.string('address');
      table.text('description');
      table.text('photos'); // JSON string
      table.integer('units_count');
      table.string('owner_id').references('id').inTable('users');
      table.timestamps(true, true);
    })
    .createTable('tenants', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('user_id').references('id').inTable('users');
      table.string('full_name');
      table.string('phone');
      table.string('email');
      table.string('national_id');
      table.string('emergency_contact');
      table.text('documents'); // JSON string
      table.timestamps(true, true);
    })
    .createTable('units', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('property_id').references('id').inTable('properties').onDelete('CASCADE');
      table.string('unit_number').notNullable();
      table.string('floor');
      table.string('status'); // vacant, occupied, maintenance
      table.decimal('monthly_rent', 10, 2);
      table.decimal('deposit_amount', 10, 2);
      table.string('tenant_id').references('id').inTable('tenants').onDelete('SET NULL');
      table.date('lease_start_date');
      table.date('lease_end_date');
      table.timestamps(true, true);
    })
    .createTable('invoices', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('unit_id').references('id').inTable('units').onDelete('CASCADE');
      table.string('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
      table.decimal('amount', 10, 2);
      table.date('due_date');
      table.string('status'); // paid, pending, overdue, partial
      table.decimal('paid_amount', 10, 2).defaultTo(0);
      table.date('payment_date');
      table.string('invoice_number');
      table.timestamps(true, true);
    })
    .createTable('payments', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('invoice_id').references('id').inTable('invoices').onDelete('CASCADE');
      table.decimal('amount', 10, 2);
      table.string('payment_method');
      table.string('transaction_reference');
      table.date('payment_date');
      table.string('receipt_url');
      table.timestamps(true, true);
    })
    .createTable('maintenance_requests', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
      table.string('unit_id').references('id').inTable('units').onDelete('CASCADE');
      table.string('property_id').references('id').inTable('properties').onDelete('CASCADE');
      table.string('title');
      table.text('description');
      table.string('priority');
      table.string('status');
      table.text('photos'); // JSON string
      table.string('assigned_to').references('id').inTable('users').onDelete('SET NULL');
      table.string('ai_classification');
      table.timestamps(true, true);
    })
    .createTable('comments', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('maintenance_id').references('id').inTable('maintenance_requests').onDelete('CASCADE');
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.text('comment');
      table.timestamps(true, true);
    })
    .createTable('notifications', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('title');
      table.text('message');
      table.string('type');
      table.boolean('read_status').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('messages', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('sender_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('receiver_id').references('id').inTable('users').onDelete('CASCADE');
      table.text('content');
      table.text('attachments'); // JSON string
      table.boolean('read_receipt').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('documents', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('property_id').references('id').inTable('properties').onDelete('CASCADE');
      table.string('unit_id').references('id').inTable('units').onDelete('CASCADE');
      table.string('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
      table.string('name');
      table.string('type');
      table.string('file_url');
      table.integer('size');
      table.string('uploaded_by').references('id').inTable('users').onDelete('SET NULL');
      table.string('version');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('documents')
    .dropTableIfExists('messages')
    .dropTableIfExists('notifications')
    .dropTableIfExists('comments')
    .dropTableIfExists('maintenance_requests')
    .dropTableIfExists('payments')
    .dropTableIfExists('invoices')
    .dropTableIfExists('units')
    .dropTableIfExists('tenants')
    .dropTableIfExists('properties')
    .dropTableIfExists('users')
    .dropTableIfExists('organizations');
};
