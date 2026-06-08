exports.up = function(knex) {
  return knex.schema
    .createTable('subscriptions', table => {
      table.string('id').primary();
      table.string('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('plan').notNullable().defaultTo('free_trial'); // starter, growth, professional, enterprise
      table.string('status').notNullable().defaultTo('trialing'); // trialing, active, past_due, canceled
      table.timestamp('trial_ends_at');
      table.timestamp('current_period_end');
      table.string('payment_method'); // evc_plus, sahal, zaad, stripe
      table.string('provider_subscription_id'); // stripe_sub_id or local ref
      table.timestamps(true, true);
    })
    .alterTable('organizations', table => {
      table.string('subscription_id').references('id').inTable('subscriptions').onDelete('SET NULL');
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('organizations', table => {
      table.dropColumn('subscription_id');
    })
    .dropTableIfExists('subscriptions');
};
