exports.up = function(knex) {
  return knex.schema.createTable('invitations', table => {
    table.string('id').primary(); // The secure random token
    table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('email').notNullable();
    table.string('role').notNullable(); // 'manager' or 'tenant'
    table.string('unit_id').references('id').inTable('units').onDelete('CASCADE'); // Optional, for tenants
    table.string('status').defaultTo('pending'); // 'pending', 'accepted', 'expired'
    table.datetime('expires_at').notNullable();
    table.string('invited_by').references('id').inTable('users').onDelete('SET NULL'); // Who created the invite
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('invitations');
};
