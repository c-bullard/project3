/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('cards', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('mana_cost');
    table.string('type_line');
    table.text('oracle_text');
    table.string('set_code');
    table.string('set_name');
    table.string('image_url');
    table.decimal('usd', 10, 2);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('cards');
};
