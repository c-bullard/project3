/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('decks').del();
  await knex('decks').insert([
    {
      name: 'Return of the King',
      description: 'Aragorn and the men of the West',
    },
    {
      name: 'I ❤︎⁠ Liv Tyler',
      description: 'Nothing but Arwen',
    },
    {
      name: 'What about Second Breakfast?',
      description: 'Hobbits shenanigans',
    },
  ]);
};
