/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable('decks', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.text('description');
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('decks');
};
