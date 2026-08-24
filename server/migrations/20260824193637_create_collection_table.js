/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable('collection', (table) => {
    table.increments('id');
    table.integer('card_id').references('cards.id').onDelete('CASCADE');
    table.integer('quantity').defaultTo(1);
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('collection');
};
