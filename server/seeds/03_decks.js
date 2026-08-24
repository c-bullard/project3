/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('decks').del();
  await knex('decks').insert([
    { name: 'Mono-Red Aggro', description: 'Ligtning Bolt for everyone' },
    {
      name: 'Azorius Control',
      description: 'Counterspell, Counterspell, Counterspell',
    },
    { name: 'Squirrels', description: 'Nothing but squirrels' },
  ]);
};
