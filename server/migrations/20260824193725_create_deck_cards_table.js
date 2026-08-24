/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable('deck_cards', (table) => {
    table.increments('id');
    table.integer('deck_id').references('decks.id');
    table.integer('card_id').references('cards.id');
    table.integer('quantity').defaultTo(1);
    table.boolean('is_commander').defaultTo(false);
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('deck_cards');
};
